import MailActivateRepository from "../../application/respository/MailActivateRepository";
import MailActivate, { Status } from "../../domain/MailActivate";
import User from "../../domain/User";
import ORMConnection from "../database/ORMConnection";

export default class MailActivateRepositoryDatabase implements MailActivateRepository {
  client: any;

  constructor(private orm: ORMConnection) {
    this.client = this.orm.open();
  }

  async save(data: MailActivate): Promise<void> {
    await this.client.mailActivate.create({
      data: {
        id: data.id,
        email: data.user.email.getValue(),
        token: data.token,
        status: Status[data.status]
      }
    });
  }

  async get(user: User, status: Status): Promise<MailActivate | undefined> {
    const data = await this.client.mailActivate.findFirst({
      where: {
        email: user.email.getValue(),
        status: Status[status]
      }
    });

    if(!data) return;
    return new MailActivate(data.id, user, data.status, data.token);
  }

  async update(data: MailActivate, newData: Partial<any>): Promise<void> {
    await this.client.mailActivate.update({
      where: { id: data.id },
      data: {
        ...newData as any
      }
    });
  }
}