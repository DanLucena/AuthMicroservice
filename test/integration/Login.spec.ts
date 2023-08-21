import UserRepository from "../../src/application/respository/UserRepository";
import Login from "../../src/application/usecases/Login";
import User from "../../src/domain/User";
import { CustomError } from "../../src/infra/errors/CustomError";

const users = [
  User.create('validEmail2@gmail.com', 'validPassword*123', 'TestUser'),
  User.create('validEmail@gmail.com', 'validPassword*123', 'TestUser'),
]

const userRepository: UserRepository = {
  save: async (user: User) => {},
  get: async (email: string) => { return users.find(item => item.email.value === email) || null },
  update: async (user: User, newData: Partial<User>): Promise<void> => {}
}

test('must raise when user does not exists', () => {
  const input = { email: 'validEmail3@gmail.com', password: 'validPassword*123' };
  const usecase = new Login(userRepository); 

  expect(async () => await usecase.execute(input)).rejects.toThrow(new CustomError('User does not exists'));
});

test('must raise when pass wrong password', () => {
  const input = { email: 'validEmail2@gmail.com', password: 'validPassword*12345' };
  const usecase = new Login(userRepository); 

  expect(async () => await usecase.execute(input)).rejects.toThrow(new CustomError('Wrong password'));
});

test('must raise when account is not activated', () => {
  const input = { email: 'validEmail2@gmail.com', password: 'validPassword*123' };
  const usecase = new Login(userRepository); 

  expect(async () => await usecase.execute(input)).rejects.toThrow(new CustomError('Inactive account'));
});

test('must login into account', async () => {
  users[1].active();
  const input = { email: 'validEmail@gmail.com', password: 'validPassword*123' };
  const usecase = new Login(userRepository);
  const token = await usecase.execute(input);

  expect(token).toBeDefined();
});