import PasswordResetRepository from "../../application/respository/PasswordResetRepository";
import { Status } from "../../domain/MailActivate";
import PasswordReset from "../../domain/PasswordReset";
import User from "../../domain/User";
import ORMConnection from "../database/ORMConnection";

export default class PasswordResetRepositoryDatabase implements PasswordResetRepository {
  client: any;

  constructor(private orm: ORMConnection) {
    this.client = this.orm.open();
  }
  
  async save(data: PasswordReset): Promise<void> {
    await this.client.passwordReset.create({
      data: {
        id: data.id,
        email: data.user.email.value,
        otp: data.code,
        status: Status[data.status],
        token: data.token
      }
    });
  }

  async get(user: User, status: Status): Promise<PasswordReset | undefined> {
    const data = await this.client.passwordReset.findFirst({
      where: {
        email: user.email.value,
        status: Status[status]
      }
    });

    if(!data) return;
    return new PasswordReset(data.id, user, data.status, data.otp, data.token);
  }

  async update(data: PasswordReset, newData: Partial<any>): Promise<void> {
    await this.client.passwordReset.update({
      where: { id: data.id },
      data: {
        ...newData as any
      }
    });
  }
}