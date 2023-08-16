export type ReturnType = {
  type: 'JSON' | 'File'
}

export default interface HttpServer {
  on(method: string, url: string, callback: Function, returnType?: ReturnType): void;
  listen(port: number): void;
}