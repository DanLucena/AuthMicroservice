import RepositoryFactoryInterface from "../../application/respository/RepositoryFactory";
import Active from "../../application/usecases/Active";
import CreateUser from "../../application/usecases/CreateUser";
import Login from "../../application/usecases/Login";
import ResendConfirmationMail from "../../application/usecases/ResendConfirmationMail";
import SendConfirmationMail from "../../application/usecases/mailer/SendConfirmationMail";
import Verify from "../../application/usecases/Verify";
import MailerInterface from "../mailer/MailerInterface";
import Queue from "../queue/Queue";
import ValidatePasswordResetCode from "../../application/usecases/ValidatePasswordResetCode";
import UserPasswordReset from "../../application/usecases/UserPasswordReset";
import SendPasswordMail from "../../application/usecases/mailer/SendPasswordMail";
import ChangePassword from "../../application/usecases/ChangePassword";
import InMemoryConnection from "../database/InMemoryConnection";

export default class UsecaseFactory {
  constructor(
    private repositories: RepositoryFactoryInterface,
    private queue: Queue,
    private mailer: MailerInterface,
    private redis: InMemoryConnection
  ) { }

  createUser() {
    return new CreateUser(this.repositories.userRepository(), this.queue);
  }

  login() {
    return new Login(this.repositories, this.redis);
  }

  verify() {
    return new Verify(this.redis);
  }

  sendConfirmationMail() {
    return new SendConfirmationMail(this.mailer, this.repositories.mailActivateRepository());
  }

  resendConfirmationMail() {
    return new ResendConfirmationMail(this.repositories, this.queue);
  }

  active() {
    return new Active(this.repositories.userRepository(), this.repositories.mailActivateRepository());
  }

  passwordReset() {
    return new UserPasswordReset(this.repositories, this.queue);
  }

  sendPasswordReset() {
    return new SendPasswordMail(this.repositories, this.mailer);
  }

  validatePasswordCode() {
    return new ValidatePasswordResetCode(this.repositories);
  }

  changePassword() {
    return new ChangePassword(this.repositories);
  }
}