import { v4 as uuidv4 } from 'uuid';
import Email from './Email';
import Password from './Password';
import { CustomError } from '../infra/errors/CustomError';

export default class User {
  private constructor(readonly id: string, readonly email: Email, readonly password: Password, readonly username: string, public isActive: boolean) { }

  static create(email: string, password: string, username: string) {
    const id = uuidv4();
    const isActive = false;

    return new User(id, new Email(email), Password.create(password), username, isActive);
  }

  static restore(id: string, email: string, password: string, username: string, isActive: boolean) {
    return new User(id, new Email(email), Password.restore(password), username, isActive);
  }

  public active() {
    if(this.isActive) throw new CustomError('Cant activate an account that is already active');
    this.isActive = true;
  }
}