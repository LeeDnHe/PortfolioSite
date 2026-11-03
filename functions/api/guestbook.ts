import { handleGuestbook } from '../../server/guestbook.ts';
import { d1Store, type D1Database } from '../../server/store.ts';

/* Cloudflare Pages 진입 파일 — /api/guestbook. 본체는 server/guestbook.ts
   대시보드 설정: D1 바인딩 DB, 비밀 환경 변수 GUESTBOOK_KEY */

interface Env {
  DB: D1Database;
  GUESTBOOK_KEY?: string;
}

export const onRequest = (ctx: { request: Request; env: Env }): Promise<Response> =>
  handleGuestbook(ctx.request, {
    store: d1Store(ctx.env.DB, 'guestbook'),
    adminKey: ctx.env.GUESTBOOK_KEY ?? '',
    ip: ctx.request.headers.get('cf-connecting-ip') ?? '',
  });
