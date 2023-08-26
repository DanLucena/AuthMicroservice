import { RedisClientType, createClient } from 'redis';
import InMemoryConnection from "./InMemoryConnection";

export default class RedisAdapter implements InMemoryConnection {
  client: RedisClientType;
  
  constructor() {
    this.client = createClient();
  }

  async expires(key: string, timeToLive: number): Promise<void> {
    await this.client.expire(key, timeToLive);
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  async set(key: string, value: any): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<any> {
    return this.client.get(key);
  }

  async delete(key: string): Promise<any> {
    await this.client.del(key);
  }
}