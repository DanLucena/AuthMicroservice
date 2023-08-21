import MailActivateRepository from "../../src/application/respository/MailActivateRepository"
import PasswordResetRepository from "../../src/application/respository/PasswordResetRepository"
import RepositoryFactoryInterface from "../../src/application/respository/RepositoryFactory"
import UserRepository from "../../src/application/respository/UserRepository"
import ChangePassword from "../../src/application/usecases/ChangePassword"
import MailActivate, { Status } from "../../src/domain/MailActivate"
import PasswordReset from "../../src/domain/PasswordReset"
import User from "../../src/domain/User"
import { CustomError } from "../../src/infra/errors/CustomError"

let users: User[];
let passwordReset: PasswordReset[];
let repositoryFactory: RepositoryFactoryInterface;

beforeEach(() => {
  users = [User.create('validEmail2@gmail.com', 'validPassword*123', 'TestUser')];
  passwordReset = [PasswordReset.create(users[0])];

  repositoryFactory = {
    userRepository: (): UserRepository => {
      return {
        save: async (user: User) => { },
        get: async (email: string) => { return users.find(item => item.email.value === email) || null },
        update: async (user: User, newData: Partial<User>): Promise<void> => { }
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
        get: async (user, status) => { return passwordReset.find(item => item.user.email.value === user.email.value && item.status === status) },
        save: async (data) => { },
        update: async (data, newData) => { passwordReset[0].conclude() },
      }
    }
  }
});

test('must be able to change user password', async () => {
  const usecase = new ChangePassword(repositoryFactory);
  await usecase.execute({email: 'validEmail2@gmail.com', password: 'newValidPassword*123', token: passwordReset[0].token});

  expect(passwordReset[0].status).toBe(Status.CONCLUIDO);
});

test('must raise an error when user does not exists', () => {
  const usecase = new ChangePassword(repositoryFactory);

  expect(async () => await usecase.execute({
    email: 'validEmail@gmail.com',
    password: 'newValidPassword*123',
    token: passwordReset[0].token
  })).rejects.toThrow(new CustomError('User does not existis'));
});

test('must raise an error when password is weak', () => {
  const usecase = new ChangePassword(repositoryFactory);

  expect(async () => await usecase.execute({
    email: 'validEmail2@gmail.com',
    password: '123',
    token: passwordReset[0].token
  })).rejects.toThrow(new CustomError('Invalid password'));
});

test('must raise an error when token is invalid', () => {
  const usecase = new ChangePassword(repositoryFactory);

  expect(async () => await usecase.execute({
    email: 'validEmail2@gmail.com',
    password: 'newValidPassword*123',
    token: 'aaaa'
  })).rejects.toThrow(new CustomError('Invalid token'));
});

test('must raise an error when token is invalid', () => {
  const usecase = new ChangePassword(repositoryFactory);
  passwordReset[0].conclude();

  expect(async () => await usecase.execute({
    email: 'validEmail2@gmail.com',
    password: 'newValidPassword*123',
    token: passwordReset[0].token
  })).rejects.toThrow(new CustomError('You dont have any password request solicitation'));
});