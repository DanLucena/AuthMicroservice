import { Status } from "../../domain/MailActivate";
import { CustomError } from "../../infra/errors/CustomError";
import PasswordResetRepository from "../respository/PasswordResetRepository";
import RepositoryFactoryInterface from "../respository/RepositoryFactory";
import UserRepository from "../respository/UserRepository";

interface Input {
  email: string,
  code: string
}

interface Output {
  token: string
}

export default class ValidatePasswordResetCode {
  passwordResetRepository: PasswordResetRepository;
  userRepository: UserRepository;

  constructor(private repositories: RepositoryFactoryInterface) { 
    this.passwordResetRepository = this.repositories.passwordResetRepository();
    this.userRepository = this.repositories.userRepository();
  }

  public async execute(input : Input): Promise<Output> {
    const user = await this.userRepository.get(input.email);
    if(!user) throw new CustomError('User does not existis', 400);

    const passwordResetRequest = await this.passwordResetRepository.get(user, Status.AGUARDANDO);
    if(!passwordResetRequest) throw new CustomError('You dont have any password request solicitation', 404);

    passwordResetRequest.isValidCode(input.code);
    return { token: passwordResetRequest.token };
  }
}