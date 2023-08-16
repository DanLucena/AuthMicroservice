import MailActivateRepository from "./MailActivateRepository";
import UserRepository from "./UserRepository";

export default interface RepositoryFactoryInterface {
  userRepository(): UserRepository;
  mailActivateRepository(): MailActivateRepository; 
}