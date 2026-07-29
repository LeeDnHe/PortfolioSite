import { getStore } from '@netlify/blobs';

/* 미니게임 랭킹 API — GET ?game=<id>&platform=<pc|mobile> 조회 /
   POST {game,platform,name,score} 등록.
   score는 게임에 따라 초 또는 KB. 순위는 게임×플랫폼별로 따로 보관하며
   상위 50개만 유지, 같은 닉네임은 최고 기록 하나만 남긴다 */

const GAMES = new Set(['folder-escape', 'computer-idle', 'floppy-144']);
const PLATFORMS = new Set(['pc', 'mobile']);
const KEEP = 50;
const TOP = 10;
const MAX_SCORE = 10_000_000;

interface Entry {
  name: string;
  score: number;
  at: number;
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export default async (req: Request): Promise<Response> => {
  const store = getStore({ name: 'leaderboard', consistency: 'strong' });
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const game = url.searchParams.get('game') ?? '';
    const platform = url.searchParams.get('platform') ?? '';
    if (!GAMES.has(game)) return json({ error: 'unknown game' }, 400);
    if (!PLATFORMS.has(platform)) return json({ error: 'unknown platform' }, 400);
    const list = ((await store.get(`${game}:${platform}`, { type: 'json' })) ?? []) as Entry[];
    return json({ top: list.slice(0, TOP) });
  }

  if (req.method === 'POST') {
    let body: { game?: unknown; platform?: unknown; name?: unknown; score?: unknown };
    try {
      body = (await req.json()) as typeof body;
    } catch {
      return json({ error: 'invalid json' }, 400);
    }
    const game = typeof body.game === 'string' ? body.game : '';
    const platform = typeof body.platform === 'string' ? body.platform : '';
    const name = (typeof body.name === 'string' ? body.name : '').trim().slice(0, 12) || '무명';
    const score = typeof body.score === 'number' ? Math.round(body.score * 10) / 10 : NaN;
    if (!GAMES.has(game)) return json({ error: 'unknown game' }, 400);
    if (!PLATFORMS.has(platform)) return json({ error: 'unknown platform' }, 400);
    if (!Number.isFinite(score) || score <= 0 || score > MAX_SCORE) {
      return json({ error: 'invalid score' }, 400);
    }

    const key = `${game}:${platform}`;
    const list = ((await store.get(key, { type: 'json' })) ?? []) as Entry[];
    const nick = name.toLowerCase();
    const existing = list.find((e) => e.name.toLowerCase() === nick);
    if (existing && existing.score >= score) {
      // 이미 같은 닉네임의 더 좋은 기록이 있다
      return json({
        rank: list.indexOf(existing) + 1,
        improved: false,
        top: list.slice(0, TOP),
      });
    }
    const merged = list.filter((e) => e.name.toLowerCase() !== nick);
    merged.push({ name, score, at: Date.now() });
    merged.sort((a, b) => b.score - a.score || a.at - b.at);
    const trimmed = merged.slice(0, KEEP);
    await store.setJSON(key, trimmed);
    const idx = trimmed.findIndex((e) => e.name.toLowerCase() === nick);
    return json({
      rank: idx >= 0 ? idx + 1 : null, // null = 50위 밖으로 밀려남
      improved: true,
      top: trimmed.slice(0, TOP),
    });
  }

  return json({ error: 'method not allowed' }, 405);
};

export const config = { path: '/api/leaderboard' };
