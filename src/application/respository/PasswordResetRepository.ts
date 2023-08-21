import { Status } from "../../domain/MailActivate";
import PasswordReset from "../../domain/PasswordReset";
import User from "../../domain/User";

export default interface PasswordResetRepository {
  save(data: PasswordReset): Promise<void>;
  get(user: User, status: Status): Promise<PasswordReset | undefined>;
  update(data: PasswordReset, newData: Partial<any>): Promise<void>;
}