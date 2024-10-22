import Redis from 'ioredis';
import logger from '../utils/logger';

const redis = new Redis(process.env.REDIS_URL);

redis.on('error', (error) => {
  logger.error('Redis error:', error);
});

export { redis };