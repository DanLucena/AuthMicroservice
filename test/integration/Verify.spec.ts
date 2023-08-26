import InMemoryConnection from "../../src/infra/database/InMemoryConnection";
import Verify from "../../src/application/usecases/Verify";
import User from "../../src/domain/User";
import Login from "../../src/application/usecases/Login";
import RepositoryFactoryInterface from "../../src/application/respository/RepositoryFactory";
import UserRepository from "../../src/application/respository/UserRepository";
import MailActivateRepository from "../../src/application/respository/MailActivateRepository";
import MailActivate, { Status } from "../../src/domain/MailActivate";
import PasswordResetRepository from "../../src/application/respository/PasswordResetRepository";

const users = [
  User.create('validEmail@gmail.com', 'validPassword*123', 'TestUser'),
]

const tokens: any = [];

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
      get: async (user: User, status: Status) => { return undefined },
      save: async (data) => { },
      update: async (data, newData) => { },
    }
  }
}

const redis: InMemoryConnection = {
  connect: async (): Promise<void> => { },
  disconnect: async (): Promise<void> => { },
  set: jest.fn(),
  get: async (key: string): Promise<any> => { return tokens[0] },
  expires:  jest.fn(),
  delete: async (key: string): Promise<void> => { }
}

beforeAll(() => {
  users[0].active();
});

test("must validate a token", async () => {
  const loginUsecase = new Login(repositoryFactory, redis);
  const { token, refreshToken, userId } = await loginUsecase.execute({ email: 'validEmail@gmail.com', password: 'validPassword*123' });

  const usecase = new Verify(redis);
  const output = await usecase.execute({ userId, token, refreshToken });

  expect(output.email).toBe('validEmail@gmail.com');
});

test("must return a new token when refresh token still valid", async () => {
  const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  
  const loginUsecase = new Login(repositoryFactory, redis);
  const { token , refreshToken, userId } = await loginUsecase.execute({ email: 'validEmail@gmail.com', password: 'validPassword*123' });
  tokens.push(refreshToken);
  
  const usecase = new Verify(redis);
  const output = await usecase.execute({ userId, refreshToken, token: invalidToken });

  expect(output.email).toBe(users[0].email.value);
  expect(output.token).toBeDefined();
});

test("must raise an error", () => {
  const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  const usecase = new Verify(redis);
  expect(async () => await usecase.execute({ userId: users[0].id, refreshToken: invalidToken, token: invalidToken })).rejects.toThrow();
});