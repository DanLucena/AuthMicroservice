import { Status } from "../../domain/MailActivate";
import Password from "../../domain/Password";
import { CustomError } from "../../infra/errors/CustomError";
import PasswordResetRepository from "../respository/PasswordResetRepository";
import RepositoryFactoryInterface from "../respository/RepositoryFactory";
import UserRepository from "../respository/UserRepository";

interface Input {
  email: string,
  token: string,
  password: string
}

export default class ChangePassword {
  passwordResetRepository: PasswordResetRepository;
  userRepository: UserRepository;

  constructor(private repositories: RepositoryFactoryInterface) {
    this.passwordResetRepository = this.repositories.passwordResetRepository();
    this.userRepository = this.repositories.userRepository();
  }

  public async execute(input: Input) {
    const user = await this.userRepository.get(input.email);
    if(!user) throw new CustomError('User does not existis', 400);

    const passwordResetRequest = await this.passwordResetRepository.get(user, Status.AGUARDANDO);
    if(!passwordResetRequest) throw new CustomError('You dont have any password request solicitation', 404);

    passwordResetRequest.isValidToken(input.token);

    const newPassword = Password.create(input.password);
    await this.userRepository.update(user, { password: newPassword.value });
    await this.passwordResetRepository.update(passwordResetRequest, { status: Status[Status.CONCLUIDO] });
  }
} 