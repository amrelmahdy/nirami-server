import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  
  // Store string or JSON value
  async setValue(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await this.redis.set(key, stringValue, 'EX', ttlSeconds);
  }

  // Retrieve value
  async getValue<T = any>(key: string): Promise<T | null> {
    const result = await this.redis.get(key);
    try {
      return result ? JSON.parse(result) : null;
    } catch {
      return result as unknown as T;
    }
  }

  // Delete key
  async deleteValue(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
