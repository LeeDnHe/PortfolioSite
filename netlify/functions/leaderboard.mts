import { getStore } from '@netlify/blobs';

/* 미니게임 랭킹 API — GET ?game=<id> 조회 / POST {game,name,score} 등록
   score는 게임에 따라 초 또는 KB. 게임별로 상위 50개만 보관하고,
   같은 닉네임은 최고 기록 하나만 유지한다 */

const GAMES = new Set(['folder-escape', 'computer-idle', 'floppy-144']);
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
    if (!GAMES.has(game)) return json({ error: 'unknown game' }, 400);
    const list = ((await store.get(game, { type: 'json' })) ?? []) as Entry[];
    return json({ top: list.slice(0, TOP) });
  }

  if (req.method === 'POST') {
    let body: { game?: unknown; name?: unknown; score?: unknown };
    try {
      body = (await req.json()) as typeof body;
    } catch {
      return json({ error: 'invalid json' }, 400);
    }
    const game = typeof body.game === 'string' ? body.game : '';
    const name = (typeof body.name === 'string' ? body.name : '').trim().slice(0, 12) || '무명';
    const score = typeof body.score === 'number' ? Math.round(body.score * 10) / 10 : NaN;
    if (!GAMES.has(game)) return json({ error: 'unknown game' }, 400);
    if (!Number.isFinite(score) || score <= 0 || score > MAX_SCORE) {
      return json({ error: 'invalid score' }, 400);
    }

    const list = ((await store.get(game, { type: 'json' })) ?? []) as Entry[];
    const key = name.toLowerCase();
    const existing = list.find((e) => e.name.toLowerCase() === key);
    if (existing && existing.score >= score) {
      // 이미 같은 닉네임의 더 좋은 기록이 있다
      return json({
        rank: list.indexOf(existing) + 1,
        improved: false,
        top: list.slice(0, TOP),
      });
    }
    const merged = list.filter((e) => e.name.toLowerCase() !== key);
    merged.push({ name, score, at: Date.now() });
    merged.sort((a, b) => b.score - a.score || a.at - b.at);
    const trimmed = merged.slice(0, KEEP);
    await store.setJSON(game, trimmed);
    const idx = trimmed.findIndex((e) => e.name.toLowerCase() === key);
    return json({
      rank: idx >= 0 ? idx + 1 : null, // null = 50위 밖으로 밀려남
      improved: true,
      top: trimmed.slice(0, TOP),
    });
  }

  return json({ error: 'method not allowed' }, 405);
};

export const config = { path: '/api/leaderboard' };
