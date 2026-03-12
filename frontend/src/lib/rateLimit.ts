import { getRedis } from "@/lib/redis";

type RateLimitResult = {
    allowed: boolean;
    remaining: number;
    resetAt: number;
};

export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const redis = getRedis();
    const now = Math.floor(Date.now() / 1000);
    const windowKey = `rate:${key}:${Math.floor(now / windowSeconds)}`;

    const count = await redis.incr(windowKey);
    if (count === 1) await redis.expire(windowKey, windowSeconds);

    const remaining = Math.max(limit - count, 0);

    return {
        allowed: count <= limit,
        remaining,
        resetAt: (Math.floor(now / windowSeconds) + 1) * windowSeconds,
    };
}

