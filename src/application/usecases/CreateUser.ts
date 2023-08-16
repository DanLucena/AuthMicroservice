import UserRepository from "../respository/UserRepository";
import User from "../../domain/User";
import Queue from "../../infra/queue/Queue";
import TokenGenerator from "../../domain/TokenGenerator";
import getEmailFormat from "../../infra/mailer/view/ConfirmationMailView";

type Input = {
  username: string,
  email: string,
  password: string
}

type Output = {
  id: string
}

export default class CreateUser {
  constructor(private userRepository: UserRepository, private queue: Queue) {}

  public async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.get(input.email);
    if(user) throw new Error('User already exists');

    const newUser = User.create(input.email, input.password, input.username);

    await this.userRepository.save(newUser);
    await this.queue.publish('mailer', { 
      to: newUser.email.getValue(),
      subject: 'Account Confirmation',
    });

    return { id: newUser.id };
  }
}