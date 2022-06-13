const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (error) => console.log(`Redis client not connected to the server: ${error}`)
    );
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const getValue = await promisify(this.client.get).bind(this.client);
    const val = await getValue(key);
    return val;
  }

  async set(key, value, duration) {
    await this.client.set(key, value);
    await this.client.expire(key, duration);
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
