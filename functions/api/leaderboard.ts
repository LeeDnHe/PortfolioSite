import { handleLeaderboard } from '../../server/leaderboard.ts';
import { d1Store, type D1Database } from '../../server/store.ts';

/* Cloudflare Pages 진입 파일 — /api/leaderboard. 본체는 server/leaderboard.ts */

interface Env {
  DB: D1Database;
}

export const onRequest = (ctx: { request: Request; env: Env }): Promise<Response> =>
  handleLeaderboard(ctx.request, d1Store(ctx.env.DB, 'leaderboard'));
