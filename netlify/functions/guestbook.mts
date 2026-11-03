import { getStore } from '@netlify/blobs';
import { handleGuestbook } from '../../server/guestbook.ts';
import { blobsStore } from '../blobs.mts';

/* Netlify 진입 파일 — 본체는 server/guestbook.ts. Cloudflare 이전이 끝나면 삭제 */

export default async (req: Request): Promise<Response> =>
  handleGuestbook(req, {
    store: blobsStore(getStore({ name: 'guestbook', consistency: 'strong' })),
    adminKey: process.env.GUESTBOOK_KEY ?? '',
    ip: req.headers.get('x-nf-client-connection-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? '',
  });

export const config = { path: '/api/guestbook' };
