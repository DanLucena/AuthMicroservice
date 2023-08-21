import { Status } from "../../../domain/MailActivate"
import PasswordReset from "../../../domain/PasswordReset"
import User from "../../../domain/User"
import MailerInterface from "../../../infra/mailer/MailerInterface"
import getEmailFormat from "../../../infra/mailer/view/ResetPasswordMailView"
import PasswordResetRepository from "../../respository/PasswordResetRepository"
import RepositoryFactoryInterface from "../../respository/RepositoryFactory"

type Input = {
  to: User,
  subject: string
}

export default class SendPasswordMail {
  passwordResetRepository: PasswordResetRepository;

  constructor(private repositoryFactory: RepositoryFactoryInterface, private mailer: MailerInterface) {
    this.passwordResetRepository = this.repositoryFactory.passwordResetRepository();
  }

  public async execute(input: Input) {
    const openPasswordResetRequest = await this.passwordResetRepository.get(input.to, Status.AGUARDANDO);
    if(openPasswordResetRequest) {
      await this.passwordResetRepository.update(openPasswordResetRequest, { status: Status[Status.CANCELADO] });
    }

    const passwordReset = PasswordReset.create(input.to);
    await this.passwordResetRepository.save(passwordReset);

    return await this.mailer.send(input.to.email.value, input.subject, getEmailFormat(passwordReset.code, input.to.email.value));
  }
}