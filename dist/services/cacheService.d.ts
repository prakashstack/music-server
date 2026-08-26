export declare const cacheService: {
    get: <T>(key: string) => T | undefined;
    set: <T>(key: string, value: T, ttl?: number) => void;
    del: (key: string) => void;
    flush: () => void;
};
//# sourceMappingURL=cacheService.d.ts.map