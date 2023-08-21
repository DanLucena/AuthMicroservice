import { CustomError } from '../infra/errors/CustomError';
import { Status } from "./MailActivate";
import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';
import User from './User';
import TokenGenerator from './TokenGenerator';

export default class PasswordReset {
  private static idGenerator = customAlphabet(process.env.ALPHABET_CRYPTO || '', 6);
  static tokenGenerator: TokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');

  constructor(readonly id: string, readonly user: User, public status: Status, readonly code: string, readonly token: string) { }

  static create(user: User) {
    const id = uuidv4();
    const status = Status.AGUARDANDO;
    const code = PasswordReset.idGenerator(6);
    const token = PasswordReset.tokenGenerator.sign(user, 3600)

    return new PasswordReset(id, user, status, code, token);
  }

  public isValidCode(code: string) {
    if(this.code !== code) throw new CustomError('Invalid code', 400);
    return true;
  }

  public isValidToken(token: string) {
    if(this.token !== token) throw new CustomError('Invalid token', 400);
    return true;
  }

  public cancel() {
    this.status = Status.CANCELADO;
  }

  public conclude() {
    this.status = Status.CONCLUIDO;
  }
}