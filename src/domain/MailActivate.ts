import { v4 as uuidv4 } from 'uuid';
import TokenGenerator from "./TokenGenerator";
import User from "./User";

export enum Status {
  CANCELADO,
  AGUARDANDO,
  CONCLUIDO
}

export default class MailActivate {
  static tokenGenerator: TokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');

  constructor(readonly id: string, readonly user: User, public status: Status, readonly token: string) { }

  static create(user: User) {
    const id = uuidv4();
    const status = Status.AGUARDANDO;
    const token = MailActivate.tokenGenerator.sign({ email: user.email.value }, 86_000);

    return new MailActivate(id, user, status, token);
  }

  public verify() {
    this.status = Status.CONCLUIDO;
  }

  public cancel() {
    this.status = Status.CANCELADO;
  }
}
