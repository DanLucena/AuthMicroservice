import { CustomError } from "../../infra/errors/CustomError";
import Queue from "../../infra/queue/Queue";
import RepositoryFactoryInterface from "../respository/RepositoryFactory";
import UserRepository from "../respository/UserRepository";

interface Input {
  email: string
}

export default class UserPasswordReset {
  private userRepository: UserRepository;

  constructor(private repositoryFactory: RepositoryFactoryInterface, private queue: Queue) { 
    this.userRepository = this.repositoryFactory.userRepository();
  }

  public async execute(input: Input) {
    const user = await this.userRepository.get(input.email);
    if(!user) throw new CustomError('User does not exists', 404);
    if(!user.isActive) throw new CustomError('Account not active', 400);
    
    await this.queue.publish('password-reset-mailer', { 
      to: user,
      subject: 'Password Reset',
    });
  }
}