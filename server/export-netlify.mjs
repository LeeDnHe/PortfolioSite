/* Netlify Blobs → D1 옮기기용 SQL 만들기.
   먼저: npx netlify login && npx netlify link   (사이트 ID 는 .netlify/state.json, 토큰은 netlify CLI 설정에서 읽는다)
   실행: node server/export-netlify.mjs          → server/migrate.sql (gitignore — 건의함 글이 들어 있다)
   넣기: D1 콘솔에 붙여 넣거나 npx wrangler d1 execute portfolio --remote --file server/migrate.sql
   INSERT OR REPLACE 라 여러 번 넣어도 된다. 도메인 넘기기 직전에 한 번 더 돌린다 */

import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { getStore } from '@netlify/blobs';

const STORES = ['guestbook', 'leaderboard'];

function siteID() {
  try {
    return JSON.parse(readFileSync('.netlify/state.json', 'utf8')).siteId;
  } catch {
    throw new Error('.netlify/state.json 이 없다 — npx netlify link 먼저');
  }
}

function token() {
  if (process.env.NETLIFY_AUTH_TOKEN) return process.env.NETLIFY_AUTH_TOKEN;
  const paths = [
    join(process.env.APPDATA ?? '', 'netlify', 'Config', 'config.json'),
    join(homedir(), 'Library', 'Preferences', 'netlify', 'config.json'),
    join(homedir(), '.config', 'netlify', 'config.json'),
  ];
  for (const p of paths) {
    try {
      const cfg = JSON.parse(readFileSync(p, 'utf8'));
      const t = cfg.users?.[cfg.userId]?.auth?.token;
      if (t) return t;
    } catch {
      /* 다음 경로 */
    }
  }
  throw new Error('netlify 토큰을 못 찾았다 — npx netlify login 먼저 (또는 NETLIFY_AUTH_TOKEN)');
}

const q = (v) => `'${v.replace(/'/g, "''")}'`;

const auth = { siteID: siteID(), token: token() };
const lines = [];
for (const name of STORES) {
  const store = getStore({ name, consistency: 'strong', ...auth });
  const { blobs } = await store.list();
  for (const { key } of blobs) {
    const value = await store.get(key, { type: 'json' });
    if (value == null) continue;
    lines.push(`INSERT OR REPLACE INTO kv (key, value) VALUES (${q(`${name}/${key}`)}, ${q(JSON.stringify(value))});`);
  }
  console.log(`${name}: ${blobs.length}`);
}
writeFileSync('server/migrate.sql', lines.join('\n') + '\n');
console.log(`server/migrate.sql — ${lines.length} rows`);
