import MailActivate, { Status } from "../../../domain/MailActivate";
import User from "../../../domain/User";
import MailerInterface from "../../../infra/mailer/MailerInterface";
import getEmailFormat from "../../../infra/mailer/view/ConfirmationMailView";
import MailActivateRepository from "../../respository/MailActivateRepository";

type Input = {
  to: User,
  subject: string
}

export default class SendConfirmationMail {
  constructor(
    private mailer: MailerInterface,
    private mailValidateRepository: MailActivateRepository,
  ) { }

  public async execute(input: Input): Promise<any> {
    const activationStatus = await this.mailValidateRepository.get(input.to, Status.AGUARDANDO);
    if(activationStatus) {
      await this.mailValidateRepository.update(activationStatus, { status: Status[Status.CANCELADO] });
    }

    const mailerValidate = MailActivate.create(input.to);
    const confirmationUrl = `${process.env.API_URL}/confirm/${mailerValidate.token}`

    await this.mailValidateRepository.save(mailerValidate);
    return await this.mailer.send(input.to.email.value, input.subject, getEmailFormat(confirmationUrl, input.to.username));
  }
}