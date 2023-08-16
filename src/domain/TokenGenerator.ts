import { sign, verify } from "jsonwebtoken";
import User from "./User";

export default class TokenGenerator {

  constructor(readonly key: string) { }

  sign(user: User, expiresInSeconds: number = 600) {
    return sign({ email: user.email.getValue() }, this.key, { expiresIn: expiresInSeconds });
  }

  verify(token: string) {
    return verify(token, this.key);
  }
}