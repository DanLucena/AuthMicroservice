import Email from "../../src/domain/Email";

test('must raise an exception when email is invalid', () => {
  expect(() => new Email('email.com')).toThrow(new Error('Invalid email'));
});

test('must create an email when it is valid', () => {
  const email = new Email('validmail@gmail.com');
  expect(email).toBeDefined();
  expect(email.getValue()).toEqual('validmail@gmail.com');
});