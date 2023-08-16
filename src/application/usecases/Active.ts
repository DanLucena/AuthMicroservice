import { Status } from "../../domain/MailActivate";
import TokenGenerator from "../../domain/TokenGenerator";
import MailActivateRepository from "../respository/MailActivateRepository";
import UserRepository from "../respository/UserRepository";

type Input = {
  token: string
}

export default class Active {
  constructor(private userRepository: UserRepository, private mailActivateRepository: MailActivateRepository) { }

  public async execute(input: Input): Promise<string> {
    const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');
    const tokenInfo = tokenGenerator.verify(input.token) as any;
    const user = await this.userRepository.get(tokenInfo.email);
    if(!user) throw new Error('User does not exists');
    
    const activationConcluded = await this.mailActivateRepository.get(user, Status.CONCLUIDO);
    if(activationConcluded) return 'success-validation.html';
    if(user.isActive) return 'success-validation.html';
    
    const activationStatus = await this.mailActivateRepository.get(user, Status.AGUARDANDO);
    if(!activationStatus) throw new Error('User does not exists');
    if(activationStatus.token !== input.token) return 'error.html';

    await this.userRepository.update(user, { isActive: true });
    await this.mailActivateRepository.update(activationStatus, { status: Status[Status.CONCLUIDO] });
    return 'success-validation.html';
  }
}