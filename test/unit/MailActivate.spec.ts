import MailActivate from "../../src/domain/MailActivate";
import User from "../../src/domain/User";

test('must be able to create an mail activate instance', () => {
  const user = User.create('validEmail@gmail.com', 'Valid*Password1', 'Emperor');
  const mailActivate = MailActivate.create(user);

  expect(mailActivate.token).toBeDefined();
});

test('must be able to change mail activate state', () => {
  const user = User.create('validEmail@gmail.com', 'Valid*Password1', 'Emperor');
  const mailActivate = MailActivate.create(user);
  mailActivate.verify();

  expect(mailActivate.status).toBe(2);
});

test('must be able to change mail activate state', () => {
  const user = User.create('validEmail@gmail.com', 'Valid*Password1', 'Emperor');
  const mailActivate = MailActivate.create(user);
  mailActivate.cancel();

  expect(mailActivate.status).toBe(0);
});