import { getStore } from '@netlify/blobs';

/* 익명 건의함 API — POST {text} 로 의견 한 건을 남긴다.
   비공개 건의함이라 목록은 관리자 키(GUESTBOOK_KEY 환경변수)가 있어야 볼 수 있고,
   방문자에게는 아무것도 돌려주지 않는다.

   글만 받는다: 텍스트 한 덩어리 외에는 어떤 것도 저장하지 않으며
   길이·작성 간격·하루 건수·링크를 전부 여기(서버)에서 막는다.
   브라우저 쪽 제한은 안내일 뿐 우회할 수 있으므로 진짜 문지기는 이 파일이다.

   작성자 식별에는 IP를 해시로 바꾼 값만 쓰고(원본 IP는 저장하지 않는다)
   도배 판정 용도로만 남긴다. 글 자체에는 작성자 정보가 붙지 않는다 */

const MIN_LEN = 2;
const MAX_LEN = 300; // 글자 수 (이모지도 한 글자로 세도록 코드 포인트 기준)
const RAW_LIMIT = 5_000; // 다듬기 전 원문 길이 — 이보다 길면 읽지도 않는다
const COOLDOWN_MS = 60_000; // 같은 사람은 1분에 한 번
const DAILY_MAX = 5; // 같은 사람은 하루 5건
const KEEP = 300; // 최신 300건만 보관 — 넘치면 오래된 것부터 지운다
const LINK_RE =
  /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|co|kr|jp|cn|ru|xyz|top|shop|link|click|me|gg|tv|biz|info|site|online|store)\b)/i;

interface Post {
  id: string;
  text: string;
  at: number;
}

/** 도배 판정용 작성 기록 — 해시된 작성자별로 하나 */
interface Rate {
  /** 마지막 작성 시각 */
  last: number;
  /** 마지막 작성일 (KST) */
  day: string;
  /** 그날 작성한 건수 */
  count: number;
  /** 마지막 글의 해시 — 같은 글을 반복해 올리는 것을 막는다 */
  hash: string;
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

async function sha256(v: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

/** 원본 IP는 남기지 않는다 — 해시만 도배 판정에 쓴다 */
async function writerHash(req: Request): Promise<string> {
  const h = req.headers;
  const ip = (
    h.get('x-nf-client-connection-ip') ??
    h.get('x-forwarded-for')?.split(',')[0] ??
    'unknown'
  ).trim();
  return sha256(`guestbook:${ip}`);
}

/** 하루 상한은 한국 시간 자정에 풀린다 */
function kstDay(now: number): string {
  return new Date(now + 9 * 3_600_000).toISOString().slice(0, 10);
}

function secondsToKstMidnight(now: number): number {
  const shifted = now + 9 * 3_600_000;
  return Math.ceil((86_400_000 - (shifted % 86_400_000)) / 1000);
}

/** 글만 남긴다 — 제어문자·보이지 않는 문자를 털고 빈 줄을 접는다 */
function clean(raw: string): string {
  return raw
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '') // 제어문자
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // 보이지 않는 문자
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function adminKey(): string {
  return process.env.GUESTBOOK_KEY ?? '';
}

function isAdmin(req: Request, url: URL): boolean {
  const key = adminKey();
  if (!key) return false;
  const given = req.headers.get('x-admin-key') ?? url.searchParams.get('key') ?? '';
  return given.length === key.length && given === key;
}

export default async (req: Request): Promise<Response> => {
  const store = getStore({ name: 'guestbook', consistency: 'strong' });
  const url = new URL(req.url);

  /* --- 읽기 · 삭제는 관리자 전용 (방문자에게는 목록 자체가 없다) --- */
  if (req.method === 'GET' || req.method === 'DELETE') {
    if (!adminKey()) return json({ error: 'admin key not configured' }, 503);
    if (!isAdmin(req, url)) return json({ error: 'unauthorized' }, 401);

    const posts = ((await store.get('posts', { type: 'json' })) ?? []) as Post[];

    if (req.method === 'GET') return json({ count: posts.length, posts });

    const id = url.searchParams.get('id') ?? '';
    const kept = posts.filter((p) => p.id !== id);
    if (kept.length === posts.length) return json({ error: 'not found' }, 404);
    await store.setJSON('posts', kept);
    return json({ ok: true, count: kept.length });
  }

  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  /* --- 작성 --- */
  let body: { text?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return json({ error: 'invalid json' }, 400);
  }
  const raw = typeof body.text === 'string' ? body.text : '';
  if (raw.length > RAW_LIMIT) return json({ error: 'too_long', max: MAX_LEN }, 400);

  const text = clean(raw);
  const len = [...text].length;
  if (len < MIN_LEN) return json({ error: 'empty' }, 400);
  if (len > MAX_LEN) return json({ error: 'too_long', max: MAX_LEN }, 400);
  if (LINK_RE.test(text)) return json({ error: 'link' }, 400);

  const now = Date.now();
  const rateKey = `rate:${await writerHash(req)}`;
  const rate = (await store.get(rateKey, { type: 'json' })) as Rate | null;
  const today = kstDay(now);

  if (rate) {
    const since = now - rate.last;
    if (since < COOLDOWN_MS) {
      return json({ error: 'cooldown', retryAfter: Math.ceil((COOLDOWN_MS - since) / 1000) }, 429);
    }
    if (rate.day === today && rate.count >= DAILY_MAX) {
      return json({ error: 'daily', retryAfter: secondsToKstMidnight(now) }, 429);
    }
  }

  const hash = await sha256(text);
  if (rate?.hash === hash) return json({ error: 'duplicate' }, 400);

  const posts = ((await store.get('posts', { type: 'json' })) ?? []) as Post[];
  posts.unshift({ id: crypto.randomUUID(), text, at: now });
  await store.setJSON('posts', posts.slice(0, KEEP));
  const next: Rate = {
    last: now,
    day: today,
    count: rate && rate.day === today ? rate.count + 1 : 1,
    hash,
  };
  await store.setJSON(rateKey, next);

  return json({ ok: true, at: now, cooldown: Math.ceil(COOLDOWN_MS / 1000) });
};

export const config = { path: '/api/guestbook' };
