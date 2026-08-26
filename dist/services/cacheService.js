"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default({ stdTTL: 1800, checkperiod: 600 });
exports.cacheService = {
    get: (key) => {
        return cache.get(key);
    },
    set: (key, value, ttl) => {
        if (ttl) {
            cache.set(key, value, ttl);
        }
        else {
            cache.set(key, value);
        }
    },
    del: (key) => {
        cache.del(key);
    },
    flush: () => {
        cache.flushAll();
    },
};
//# sourceMappingURL=cacheService.js.map