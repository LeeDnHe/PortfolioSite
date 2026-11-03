-- D1 표 정의. Cloudflare 대시보드 D1 콘솔에서 한 번 실행한다.
-- 키 = "<이름공간>/<키>": guestbook/posts, guestbook/rate:<해시>, leaderboard/<game>:<platform>
-- 값 = JSON 문자열 (server/store.ts 의 d1Store)
CREATE TABLE IF NOT EXISTS kv (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
