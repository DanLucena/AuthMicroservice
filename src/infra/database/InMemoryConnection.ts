export default interface InMemoryConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  set(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
  expires(key: string, timeToLive: number): Promise<void>;
  delete(key: string): Promise<void>;
}