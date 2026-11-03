import type { getStore } from '@netlify/blobs';
import type { KvStore } from '../server/store.ts';

/* Netlify Blobs 를 KvStore 모양으로 감싼다. functions/ 밖에 두어 함수로 잡히지 않게 한다 */

export function blobsStore(store: ReturnType<typeof getStore>): KvStore {
  return {
    get: async <T,>(key: string) => ((await store.get(key, { type: 'json' })) ?? null) as T | null,
    set: async (key, value) => {
      await store.setJSON(key, value);
    },
  };
}
