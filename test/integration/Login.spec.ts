import MailActivateRepository from "../../src/application/respository/MailActivateRepository";
import PasswordResetRepository from "../../src/application/respository/PasswordResetRepository";
import RepositoryFactoryInterface from "../../src/application/respository/RepositoryFactory";
import UserRepository from "../../src/application/respository/UserRepository";
import Login from "../../src/application/usecases/Login";
import MailActivate, { Status } from "../../src/domain/MailActivate";
import User from "../../src/domain/User";
import InMemoryConnection from "../../src/infra/database/InMemoryConnection";
import { CustomError } from "../../src/infra/errors/CustomError";

const users = [
  User.create('validEmail2@gmail.com', 'validPassword*123', 'TestUser'),
  User.create('validEmail@gmail.com', 'validPassword*123', 'TestUser'),
]

const repositoryFactory: RepositoryFactoryInterface = {
  userRepository: (): UserRepository => {
    return {
      save: async (user: User) => {},
      get: async (email: string) => { return users.find(item => item.email.value === email) || null },
      update: async (user: User, newData: Partial<User>): Promise<void> => {}
    }
  },
  mailActivateRepository: (): MailActivateRepository => {
    return {
      get: async (user: User, status: Status) => { return undefined },
      save: async (data: MailActivate) => { },
      update: async (data: MailActivate, newData: any) => { },
    }
  },
  passwordResetRepository: function (): PasswordResetRepository {
    return {
      get: async (user, status) => { return undefined },
      save: async (data) => { },
      update: async (data, newData) => { },
    }
  }
}

const redis: InMemoryConnection = {
  connect: async (): Promise<void> => { },
  disconnect: async (): Promise<void> => { },
  set: jest.fn(),
  get: async (key: string): Promise<any> => { },
  expires:  jest.fn(),
  delete: async (key: string): Promise<void> => { }
}

test('must raise when user does not exists', () => {
  const input = { email: 'validEmail3@gmail.com', password: 'validPassword*123' };
  const usecase = new Login(repositoryFactory, redis); 

  expect(async () => await usecase.execute(input)).rejects.toThrow(new CustomError('User does not exists'));
});

test('must raise when pass wrong password', () => {
  const input = { email: 'validEmail2@gmail.com', password: 'validPassword*12345' };
  const usecase = new Login(repositoryFactory, redis); 

  expect(async () => await usecase.execute(input)).rejects.toThrow(new CustomError('Wrong password'));
});

test('must raise when account is not activated', () => {
  const input = { email: 'validEmail2@gmail.com', password: 'validPassword*123' };
  const usecase = new Login(repositoryFactory, redis); 

  expect(async () => await usecase.execute(input)).rejects.toThrow(new CustomError('Inactive account'));
});

test('must login into account', async () => {
  users[1].active();
  const input = { email: 'validEmail@gmail.com', password: 'validPassword*123' };
  const usecase = new Login(repositoryFactory, redis);
  const { token, refreshToken, userId } = await usecase.execute(input);

  expect(token).toBeDefined();
  expect(refreshToken).toBeDefined();
  expect(redis.set).toHaveBeenCalledWith(users[1].id, refreshToken);
});