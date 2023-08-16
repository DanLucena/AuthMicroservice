import RepositoryFactoryInterface from "../../application/respository/RepositoryFactory";
import UserRepository from "../../application/respository/UserRepository";
import Active from "../../application/usecases/Active";
import CreateUser from "../../application/usecases/CreateUser";
import Login from "../../application/usecases/Login";
import ResendConfirmationMail from "../../application/usecases/ResendConfirmationMail";
import SendConfirmationMail from "../../application/usecases/SendConfirmationMail";
import Verify from "../../application/usecases/Verify";
import MailerInterface from "../mailer/MailerInterface";
import Queue from "../queue/Queue";

export default class UsecaseFactory {
  constructor(private repositories: RepositoryFactoryInterface, private queue: Queue, private mailer: MailerInterface) { }

  createUser() {
    return new CreateUser(this.repositories.userRepository(), this.queue);
  }

  login() {
    return new Login(this.repositories.userRepository());
  }

  verify() {
    return new Verify();
  }

  sendMail() {
    return new SendConfirmationMail(this.mailer, this.repositories.mailActivateRepository(), this.repositories.userRepository());
  }

  active() {
    return new Active(this.repositories.userRepository(), this.repositories.mailActivateRepository());
  }

  resendConfirmationMail() {
    return new ResendConfirmationMail(this.repositories, this.queue);
  }
}