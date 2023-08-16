import MailActivateRepository from "../../src/application/respository/MailActivateRepository";
import UserRepository from "../../src/application/respository/UserRepository";
import Active from "../../src/application/usecases/Active";
import MailActivate, { Status } from "../../src/domain/MailActivate";
import TokenGenerator from "../../src/domain/TokenGenerator";
import User from "../../src/domain/User";

const users = [User.create('validEmail2@gmail.com', 'validPassword*123', 'TestUser')];

const userRepository: UserRepository = {
  save: async (user: User) => { },
  get: async (email: string) => { return users.find(item => item.email.getValue() === email) || null; },
  update: async (user: User, newData: Partial<User>): Promise<void> => { user.active(); }
}

const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');
const token = tokenGenerator.sign(users[0]);

const activeMailRepository: MailActivateRepository = {
  save: async (data: MailActivate): Promise<void> => {
  },
  get: async (user: User, status: Status): Promise<MailActivate | undefined> => {
    return [new MailActivate('1', users[0], Status.AGUARDANDO, token)].find(item => item.user.email.getValue() === user.email.getValue() && item.status === status);
  },
  update: async (data: MailActivate, newData: Partial<any>): Promise<void> => {
  }
}

test('must active an existing accout', async () => {
  const usecase = new Active(userRepository, activeMailRepository);
  await usecase.execute({token: token});

  expect(users[0].isActive).toBeTruthy();
});