import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 1800, checkperiod: 600 });

export const cacheService = {
  get: <T>(key: string): T | undefined => {
    return cache.get<T>(key);
  },
  set: <T>(key: string, value: T, ttl?: number): void => {
    if (ttl) {
      cache.set(key, value, ttl);
    } else {
      cache.set(key, value);
    }
  },
  del: (key: string): void => {
    cache.del(key);
  },
  flush: (): void => {
    cache.flushAll();
  },
};
