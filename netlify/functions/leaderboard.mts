import { getStore } from '@netlify/blobs';
import { handleLeaderboard } from '../../server/leaderboard.ts';
import { blobsStore } from '../blobs.mts';

/* Netlify 진입 파일 — 본체는 server/leaderboard.ts. Cloudflare 이전이 끝나면 삭제 */

export default async (req: Request): Promise<Response> =>
  handleLeaderboard(req, blobsStore(getStore({ name: 'leaderboard', consistency: 'strong' })));

export const config = { path: '/api/leaderboard' };
