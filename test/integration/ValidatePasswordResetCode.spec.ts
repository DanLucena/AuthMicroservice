import MailActivateRepository from "../../src/application/respository/MailActivateRepository"
import PasswordResetRepository from "../../src/application/respository/PasswordResetRepository"
import RepositoryFactoryInterface from "../../src/application/respository/RepositoryFactory"
import UserRepository from "../../src/application/respository/UserRepository"
import ValidatePasswordResetCode from "../../src/application/usecases/ValidatePasswordResetCode"
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
        update: async (data, newData) => { },
      }
    }
  }
})

test('must be able to validate a password reset code', async () => {
  const usecase = new ValidatePasswordResetCode(repositoryFactory);
  const code = passwordReset[0].code;
  const output = await usecase.execute({email: 'validEmail2@gmail.com', code: code});

  expect(output.token).toBe(passwordReset[0].token);
});

test('must raise when theres no password reset with Waiting status', () => {
  const usecase = new ValidatePasswordResetCode(repositoryFactory);
  const code = passwordReset[0].code;
  passwordReset[0].conclude();

  expect(async () => await usecase.execute({email: 'validEmail2@gmail.com', code: code})).rejects.toThrow(new CustomError('You dont have any password request solicitation'));
});

test('must raise when user does not exists', () => {
  const usecase = new ValidatePasswordResetCode(repositoryFactory);
  const code = passwordReset[0].code;

  expect(async () => await usecase.execute({email: 'validEmail@gmail.com', code: code})).rejects.toThrow(new CustomError('User does not existis'));
});

test('must raise when code is wrong', () => {
  const usecase = new ValidatePasswordResetCode(repositoryFactory);
  const code = 'wrong code';

  expect(async () => await usecase.execute({email: 'validEmail2@gmail.com', code: code})).rejects.toThrow(new CustomError('Invalid code'));
});