// Redis Client for Seera AI
// Production-ready Redis integration for rate limiting, caching, and sessions

import Redis from 'ioredis';
import { logger } from './logger';

// Redis connection singleton
let redis: Redis | null = null;
let isConnected = false;

// Initialize Redis connection
export function getRedis(): Redis | null {
    if (redis) return redis;

    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        logger.warn('REDIS_URL not configured - Redis features disabled');
        return null;
    }

    try {
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            enableReadyCheck: true,
            lazyConnect: true,
        });

        redis.on('connect', () => {
            isConnected = true;
            logger.info('Redis connected successfully');
        });

        redis.on('error', (err) => {
            isConnected = false;
            logger.error('Redis connection error', { error: err });
        });

        redis.on('close', () => {
            isConnected = false;
            logger.warn('Redis connection closed');
        });

        // Connect asynchronously
        redis.connect().catch((err) => {
            logger.error('Redis initial connection failed', { error: err });
        });

        return redis;
    } catch (error) {
        logger.error('Failed to initialize Redis', { error: error as Error });
        return null;
    }
}

// Check if Redis is available
export function isRedisAvailable(): boolean {
    return isConnected && redis !== null;
}

// Rate Limiting with Redis
interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
}

export async function checkRateLimit(
    key: string,
    limit: number,
    windowMs: number
): Promise<RateLimitResult> {
    const client = getRedis();

    // Fallback to in-memory if Redis unavailable
    if (!client || !isConnected) {
        return fallbackRateLimit(key, limit, windowMs);
    }

    const now = Date.now();
    const windowKey = `ratelimit:${key}:${Math.floor(now / windowMs)}`;

    try {
        const pipeline = client.pipeline();
        pipeline.incr(windowKey);
        pipeline.pttl(windowKey);

        const results = await pipeline.exec();
        if (!results) {
            return fallbackRateLimit(key, limit, windowMs);
        }

        const count = results[0]?.[1] as number;
        let ttl = results[1]?.[1] as number;

        // Set expiry if new key
        if (ttl === -1) {
            await client.pexpire(windowKey, windowMs);
            ttl = windowMs;
        }

        const remaining = Math.max(0, limit - count);
        const resetTime = now + ttl;

        if (count > limit) {
            return {
                allowed: false,
                remaining: 0,
                resetTime,
                retryAfter: Math.ceil(ttl / 1000),
            };
        }

        return {
            allowed: true,
            remaining,
            resetTime,
        };
    } catch (error) {
        logger.error('Redis rate limit check failed', { error: error as Error, key });
        return fallbackRateLimit(key, limit, windowMs);
    }
}

// In-memory fallback rate limiter
const inMemoryRateLimits = new Map<string, { count: number; resetTime: number }>();

function fallbackRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const existing = inMemoryRateLimits.get(key);

    // Clean up expired entries periodically
    if (inMemoryRateLimits.size > 10000) {
        const entries = Array.from(inMemoryRateLimits.entries());
        for (const [k, v] of entries) {
            if (v.resetTime < now) {
                inMemoryRateLimits.delete(k);
            }
        }
    }

    if (!existing || existing.resetTime < now) {
        const resetTime = now + windowMs;
        inMemoryRateLimits.set(key, { count: 1, resetTime });
        return {
            allowed: true,
            remaining: limit - 1,
            resetTime,
        };
    }

    existing.count++;
    const remaining = Math.max(0, limit - existing.count);

    if (existing.count > limit) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: existing.resetTime,
            retryAfter: Math.ceil((existing.resetTime - now) / 1000),
        };
    }

    return {
        allowed: true,
        remaining,
        resetTime: existing.resetTime,
    };
}

// Cache helpers
export async function cacheGet<T>(key: string): Promise<T | null> {
    const client = getRedis();
    if (!client || !isConnected) return null;

    try {
        const value = await client.get(`cache:${key}`);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        logger.error('Cache get failed', { error: error as Error, key });
        return null;
    }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number = 3600): Promise<boolean> {
    const client = getRedis();
    if (!client || !isConnected) return false;

    try {
        await client.setex(`cache:${key}`, ttlSeconds, JSON.stringify(value));
        return true;
    } catch (error) {
        logger.error('Cache set failed', { error: error as Error, key });
        return false;
    }
}

export async function cacheDelete(key: string): Promise<boolean> {
    const client = getRedis();
    if (!client || !isConnected) return false;

    try {
        await client.del(`cache:${key}`);
        return true;
    } catch (error) {
        logger.error('Cache delete failed', { error: error as Error, key });
        return false;
    }
}

// Session store for additional data
export async function setSessionData(
    sessionId: string,
    data: Record<string, unknown>,
    ttlSeconds: number = 86400
): Promise<boolean> {
    const client = getRedis();
    if (!client || !isConnected) return false;

    try {
        await client.setex(`session:${sessionId}`, ttlSeconds, JSON.stringify(data));
        return true;
    } catch (error) {
        logger.error('Set session data failed', { error: error as Error, sessionId });
        return false;
    }
}

export async function getSessionData<T>(sessionId: string): Promise<T | null> {
    const client = getRedis();
    if (!client || !isConnected) return null;

    try {
        const value = await client.get(`session:${sessionId}`);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        logger.error('Get session data failed', { error: error as Error, sessionId });
        return null;
    }
}

// Distributed lock for critical operations
export async function acquireLock(
    lockName: string,
    ttlSeconds: number = 30
): Promise<string | null> {
    const client = getRedis();
    if (!client || !isConnected) return null;

    const lockId = `${Date.now()}_${Math.random().toString(36).substring(2)}`;

    try {
        const result = await client.set(`lock:${lockName}`, lockId, 'EX', ttlSeconds, 'NX');
        return result === 'OK' ? lockId : null;
    } catch (error) {
        logger.error('Acquire lock failed', { error: error as Error, lockName });
        return null;
    }
}

export async function releaseLock(lockName: string, lockId: string): Promise<boolean> {
    const client = getRedis();
    if (!client || !isConnected) return false;

    try {
        // Only release if we own the lock
        const script = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `;
        const result = await client.eval(script, 1, `lock:${lockName}`, lockId);
        return result === 1;
    } catch (error) {
        logger.error('Release lock failed', { error: error as Error, lockName });
        return false;
    }
}

// Cleanup on process exit
if (typeof process !== 'undefined') {
    process.on('beforeExit', async () => {
        if (redis) {
            await redis.quit();
            redis = null;
        }
    });
}

export default getRedis;
