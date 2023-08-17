import Password from "../../src/domain/Password";
import { CustomError } from "../../src/infra/errors/CustomError";

test('must raise an error when password does not have more than 6 characters', () => {
  expect(() => Password.create('Wk*1')).toThrow(new CustomError('Invalid password'));
});

test('must raise an error when password does not have one capital letter', () => {
  expect(() => Password.create('wk*1')).toThrow(new CustomError('Invalid password'));
});

test('must raise an error when password does not have a special character', () => {
  expect(() => Password.create('wk1')).toThrow(new CustomError('Invalid password'));
});

test('must create a password that meets all constraints', () => {
  const password = Password.create('Weak*1');

  expect(password).toBeDefined();
});

test('must return true if the provided password is the correct password', () => {
  const password = Password.restore('$2b$10$MVN35wNNt0zMRC2rx./wleoCxAARDI9h.G54hbnxMHSvxeDcQHpQ6');

  expect(password.check('Weak*1')).toBeTruthy();
});

test('must return false if the provided password is the correct password', () => {
  const password = Password.restore('$2b$10$MVN35wNNt0zMRC2rx./wleoCxAARDI9h.G54hbnxMHSvxeDcQHpQ6');

  expect(password.check('WrongPassword*1')).toBeFalsy();
});