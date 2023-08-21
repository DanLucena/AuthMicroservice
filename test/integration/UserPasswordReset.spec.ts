import MailActivateRepository from "../../src/application/respository/MailActivateRepository"
import PasswordResetRepository from "../../src/application/respository/PasswordResetRepository"
import RepositoryFactoryInterface from "../../src/application/respository/RepositoryFactory"
import UserRepository from "../../src/application/respository/UserRepository"
import UserPasswordReset from "../../src/application/usecases/UserPasswordReset"
import MailActivate, { Status } from "../../src/domain/MailActivate"
import User from "../../src/domain/User"
import { CustomError } from "../../src/infra/errors/CustomError"
import Queue from "../../src/infra/queue/Queue"

const users = [User.create('validEmail2@gmail.com', 'validPassword*123', 'TestUser')];

const repositoryFactory: RepositoryFactoryInterface = {
  userRepository: (): UserRepository => {
    return {
      save: async (user: User) => { },
      get: async (email: string) => { return users.find(item => item.email.value === email) || null },
      update: async (user: User, newData: Partial<User>): Promise<void> => { }
    }
  },
  mailActivateRepository: (): MailActivateRepository => {
    return {
      get: async (user: User, status: Status) => { return [MailActivate.create(users[0])].find(item => item.user.email.value === user.email.value && item.status === status) },
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

const queue: Queue = {
  connect: async (): Promise<void> => {},
  on: async (queueName: string, callback: Function): Promise<void> => {},
  publish: jest.fn()
}


test('must raise when user does not exists', () => {
  const usecase = new UserPasswordReset(repositoryFactory, queue);
  const email = 'validEmail@gmail.com';
  expect(async () => await usecase.execute({ email })).rejects.toThrow(new CustomError('User does not exists'));
});

test('must raise when account is not active', () => {
  const usecase = new UserPasswordReset(repositoryFactory, queue);
  const email = 'validEmail2@gmail.com';

  expect(async () => await usecase.execute({ email })).rejects.toThrow(new CustomError('Account not active'));
});

test('must create an password reset entity', async () => {
  const usecase = new UserPasswordReset(repositoryFactory, queue);
  const email = 'validEmail2@gmail.com';
  users[0].active();

  await usecase.execute({email});
  expect(queue.publish).toHaveBeenCalled();
});