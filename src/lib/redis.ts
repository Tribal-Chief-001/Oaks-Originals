const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Local thread-safe in-memory fallback cache
interface CacheItem {
  data: any;
  expiry: number;
}

const memoryCache = new Map<string, CacheItem>();

export const redisCache = {
  /**
   * Fetches data from cache. Checks Upstash Redis REST API first, then falls back to memory map.
   */
  get: async (key: string): Promise<any | null> => {
    // 1. Try Upstash Redis
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      try {
        const response = await fetch(`${UPSTASH_URL}/get/${key}`, {
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
          },
        });
        if (response.ok) {
          const json = await response.json();
          if (json && json.result) {
            console.log(`[Cache System] Hit Upstash Redis for key: ${key}`);
            return JSON.parse(json.result);
          }
        }
      } catch (e) {
        console.warn("[Redis Cache] Upstash fetch error, using local memory fallback: ", e);
      }
    }

    // 2. Try Local Memory Fallback
    const cached = memoryCache.get(key);
    if (cached) {
      if (Date.now() < cached.expiry) {
        console.log(`[Cache System] Hit local in-memory cache for key: ${key}`);
        return cached.data;
      }
      memoryCache.delete(key); // Expired
    }
    return null;
  },

  /**
   * Saves data to cache (expires after ttlSeconds). Sets in Upstash and local memory map.
   */
  set: async (key: string, value: any, ttlSeconds: number = 86400): Promise<void> => {
    const stringValue = JSON.stringify(value);

    // 1. Save to Upstash Redis
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      try {
        await fetch(`${UPSTASH_URL}/set/${key}?EX=${ttlSeconds}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
          },
          body: stringValue,
        });
        console.log(`[Cache System] Set key: ${key} in Upstash Redis (TTL: ${ttlSeconds}s)`);
      } catch (e) {
        console.warn("[Redis Cache] Upstash save error: ", e);
      }
    }

    // 2. Save to Local Memory Fallback
    memoryCache.set(key, {
      data: value,
      expiry: Date.now() + ttlSeconds * 1000,
    });
    console.log(`[Cache System] Set key: ${key} in local memory (TTL: ${ttlSeconds}s)`);
  },
};
