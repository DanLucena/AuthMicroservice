import Email from "../../src/domain/Email";
import { CustomError } from "../../src/infra/errors/CustomError";

test('must raise an exception when email is invalid', () => {
  expect(() => new Email('email.com')).toThrow(new CustomError('Invalid email'));
});

test('must create an email when it is valid', () => {
  const email = new Email('validmail@gmail.com');
  expect(email).toBeDefined();
  expect(email.value).toEqual('validmail@gmail.com');
});