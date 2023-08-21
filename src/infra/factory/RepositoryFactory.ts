import PasswordResetRepositoryDatabase from "../repository/PasswordResetRepositoryDatabase";
import PasswordResetRepository from "../../application/respository/PasswordResetRepository";
import MailActivateRepositoryDatabase from "../repository/MailActivateRepositoryDatabase";
import MailActivateRepository from "../../application/respository/MailActivateRepository";
import RepositoryFactoryInterface from "../../application/respository/RepositoryFactory";
import UserRepository from "../../application/respository/UserRepository";
import UserRepositoryDatabase from "../repository/UserRepositoryDatabase";
import ORMConnection from "../database/ORMConnection";

export default class RepositoryFactory implements RepositoryFactoryInterface {
  constructor(private ormClient: ORMConnection) { }

  passwordResetRepository(): PasswordResetRepository {
    return new PasswordResetRepositoryDatabase(this.ormClient);
  }

  userRepository(): UserRepository {
    return new UserRepositoryDatabase(this.ormClient);
  }

  mailActivateRepository(): MailActivateRepository {
    return new MailActivateRepositoryDatabase(this.ormClient);
  }
}