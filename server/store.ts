/* 서버 함수 공용 — 저장소 모양과 JSON 응답.
   건의함·랭킹 본체(guestbook.ts, leaderboard.ts)는 이 KvStore 만 알고,
   Netlify(Blobs)·Cloudflare(D1) 진입 파일이 각자 구현을 넘겨준다 */

/** 키 → JSON 값 저장소 */
export interface KvStore {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
}

export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

/* --- D1 (Cloudflare) --- */

/** D1 에서 쓰는 만큼만 적은 최소 타입 (@cloudflare/workers-types 대신) */
export interface D1Database {
  prepare(sql: string): D1Statement;
}
interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}

/** 표 kv(key, value) 하나에 이름공간(ns)을 앞에 붙여 담는다. 표 정의는 schema.sql */
export function d1Store(db: D1Database, ns: string): KvStore {
  return {
    async get<T>(key: string): Promise<T | null> {
      const row = await db
        .prepare('SELECT value FROM kv WHERE key = ?')
        .bind(`${ns}/${key}`)
        .first<{ value: string }>();
      return row ? (JSON.parse(row.value) as T) : null;
    },
    async set(key: string, value: unknown): Promise<void> {
      await db
        .prepare('INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
        .bind(`${ns}/${key}`, JSON.stringify(value))
        .run();
    },
  };
}
