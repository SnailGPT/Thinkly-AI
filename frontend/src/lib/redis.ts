import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedis(): Redis {
    if (redis) return redis;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error("UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not configured");
    }

    redis = new Redis({ url, token });
    return redis;
}

