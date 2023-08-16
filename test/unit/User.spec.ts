import User from "../../src/domain/User";

test('must be able to create a user with valid data', () => {
  const user = User.create('validEmail@gmail.com', 'Valid*Password1', 'Emperor');

  expect(user).toBeDefined();
  expect(user).toHaveProperty('id');
});

test('must raise an error when have invalid email', () => {
  expect(() => User.create('validEmail.com', 'Valid*Password1', 'Emperor')).toThrow(new Error('Invalid email'));
});

test('must raise an error when have invalid email', () => {
  expect(() => User.create('validEmail@gmail.com', 'invalid', 'Emperor')).toThrow(new Error('Invalid password'));
});

test('must be able active an account', () => {
  const user = User.create('validEmail@gmail.com', 'Valid*Password1', 'Emperor');
  user.active();
  
  expect(user.isActive).toBeTruthy();
});

test('must be raise when account is already active', () => {
  const user = User.create('validEmail@gmail.com', 'Valid*Password1', 'Emperor');
  user.active();
  
  expect(() => user.active()).toThrow(new Error('Cant activate an account that is already active'));
});
