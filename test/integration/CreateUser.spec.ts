import UserRepository from "../../src/application/respository/UserRepository";
import CreateUser from "../../src/application/usecases/CreateUser";
import { validate as uuidValidate } from 'uuid';
import User from "../../src/domain/User";
import Queue from "../../src/infra/queue/Queue";
import { CustomError } from "../../src/infra/errors/CustomError";

const userRepository: UserRepository = {
  save: async (user: User) => {},
  get: async (email: string) => { return [User.create('validEmail2@gmail.com', 'validPassword*123', 'TestUser')].find(item => item.email.getValue() === email) || null },
  update: async (user: User, newData: Partial<User>): Promise<void> => {}
}

const queue: Queue = {
  connect: async (): Promise<void> => {},
  on: async (queueName: string, callback: Function): Promise<void> => {},
  publish: async (queueName: string, data: any): Promise<void> => {}
}

test('must be able to create an user when it does not exists', async () => {
  const usecase = new CreateUser(userRepository, queue);
  const input = {username: 'TestUser', password: 'validPassword*123', email: 'validEmail@gmail.com'};
  const output = await usecase.execute(input);
  
  expect(uuidValidate(output.id)).toBeTruthy();
});

test('must raise an exception when trying to create a user that already exists', () => {
  const usecase = new CreateUser(userRepository, queue);
  const input = {username: 'TestUser', password: 'validPassword*123', email: 'validEmail2@gmail.com'};

  expect(async () => await usecase.execute(input)).rejects.toThrow(new CustomError('User already exists'));
})