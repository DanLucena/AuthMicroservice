import MailActivate, { Status } from "../../domain/MailActivate";
import { CustomError } from "../../infra/errors/CustomError";
import MailerInterface from "../../infra/mailer/MailerInterface";
import getEmailFormat from "../../infra/mailer/view/ConfirmationMailView";
import MailActivateRepository from "../respository/MailActivateRepository";
import UserRepository from "../respository/UserRepository";

type Input = {
  to: string,
  subject: string
}

export default class SendConfirmationMail {
  constructor(
    private mailer: MailerInterface,
    private mailValidateRepository: MailActivateRepository,
    private userRepository: UserRepository
  ) { }

  public async execute(input: Input): Promise<any> {
    const user = await this.userRepository.get(input.to);
    if(!user) throw new CustomError('User does not exists', 400);

    const activationStatus = await this.mailValidateRepository.get(user, Status.AGUARDANDO);
    if(activationStatus) {
      await this.mailValidateRepository.update(activationStatus, { status: Status[Status.CANCELADO] });
    }

    const mailerValidate = MailActivate.create(user);
    const confirmationUrl = `${process.env.API_URL}/confirm/${mailerValidate.token}`

    await this.mailValidateRepository.save(mailerValidate);
    return await this.mailer.send(input.to, input.subject, getEmailFormat(confirmationUrl, user.username));
  }
}