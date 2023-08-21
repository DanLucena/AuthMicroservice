import PasswordReset from "../../src/domain/PasswordReset";
import User from "../../src/domain/User";
import { CustomError } from "../../src/infra/errors/CustomError";

test("must be able to validate a token", () => {
  const user = User.create('validEmail@gmail.com', 'Valid*Password1', 'Emperor');
  const passwordReset = PasswordReset.create(user);
  const code = passwordReset.code;

  expect(passwordReset.isValidCode(code)).toBeTruthy();
});

test("must raise an error when code is not valid", () => {
  const user = User.create('validEmail@gmail.com', 'Valid*Password1', 'Emperor');
  const passwordReset = PasswordReset.create(user);
  const code = 'aaaaaa';

  expect(() => passwordReset.isValidCode(code)).toThrow(new CustomError('Invalid code'));
});