import MailActivateRepository from "./MailActivateRepository";
import PasswordResetRepository from "./PasswordResetRepository";
import UserRepository from "./UserRepository";

export default interface RepositoryFactoryInterface {
  userRepository(): UserRepository;
  mailActivateRepository(): MailActivateRepository;
  passwordResetRepository(): PasswordResetRepository;
}