import { Redis } from "ioredis";

let redis: Redis | null = null;

export function getRedis(): Redis {
    if (redis) return redis;

    const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
    if (!url) {
        throw new Error("REDIS_URL is not configured");
    }

    redis = new Redis(url, {
        maxRetriesPerRequest: 2,
        enableReadyCheck: true,
    });

    return redis;
}

