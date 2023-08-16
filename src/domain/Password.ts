import { hashSync, compareSync } from 'bcrypt';

export default class Password {
  static HASH_SALT_ROUNDS = 10;

  private constructor(readonly value: string) { }

  static create(value: string) {
    if(!Password.validate(value)) throw new Error('Invalid password');
    const hashedPassword = hashSync(value, Password.HASH_SALT_ROUNDS);

    return new Password(hashedPassword);
  }

  static restore(password: string) {
    return new Password(password);
  }

  private static validate(password: string) {
    return password.match(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
  }
  
  public check(password: string) {
    return compareSync(password, this.value);
  }
}