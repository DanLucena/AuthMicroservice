import { Status } from "../../domain/MailActivate";
import { CustomError } from "../../infra/errors/CustomError";
import Queue from "../../infra/queue/Queue";
import MailActivateRepository from "../respository/MailActivateRepository";
import RepositoryFactoryInterface from "../respository/RepositoryFactory";
import UserRepository from "../respository/UserRepository";

type Input = {
  email: string
}

export default class ResendConfirmationMail {
  private userRepository: UserRepository;
  private mailValidateRepository: MailActivateRepository;

  constructor(private repositoryFactory: RepositoryFactoryInterface, private queue: Queue) { 
    this.userRepository = this.repositoryFactory.userRepository();
    this.mailValidateRepository = this.repositoryFactory.mailActivateRepository();
  }

  public async execute(input: Input) {
    const user = await this.userRepository.get(input.email);

    if(!user) throw new CustomError('User does not exists', 400);

    const concludedActivation = await this.mailValidateRepository.get(user, Status.CONCLUIDO);
    if(concludedActivation) throw new CustomError('Account already confirmed', 400);

    await this.queue.publish('mailer', { 
      to: user,
      subject: 'Account Confirmation',
    });
  }
}