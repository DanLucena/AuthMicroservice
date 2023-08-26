import { sign, verify } from "jsonwebtoken";

export default class TokenGenerator {

  constructor(readonly key: string) { }

  sign(key: object, expiresInSeconds: number | string = 600) {
    return sign({ ...key }, this.key, { expiresIn: expiresInSeconds });
  }

  verify(token: string) {
    return verify(token, this.key);
  }
}