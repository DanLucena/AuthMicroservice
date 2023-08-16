import MailActivate, { Status } from "../../domain/MailActivate";
import User from "../../domain/User";

export default interface MailActivateRepository {
  save(data: MailActivate): Promise<void>;
  get(user: User, status: Status): Promise<MailActivate | undefined>;
  update(data: MailActivate, newData: Partial<any>): Promise<void>;
}