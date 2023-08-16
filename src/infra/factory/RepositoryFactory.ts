import MailActivateRepository from "../../application/respository/MailActivateRepository";
import RepositoryFactoryInterface from "../../application/respository/RepositoryFactory";
import UserRepository from "../../application/respository/UserRepository";
import ORMConnection from "../database/ORMConnection";
import MailActivateRepositoryDatabase from "../repository/MailActivateRepositoryDatabase";
import UserRepositoryDatabase from "../repository/UserRepositoryDatabase";

export default class RepositoryFactory implements RepositoryFactoryInterface {
  constructor(private ormClient: ORMConnection) { }

  userRepository(): UserRepository {
    return new UserRepositoryDatabase(this.ormClient);
  }

  mailActivateRepository(): MailActivateRepository {
    return new MailActivateRepositoryDatabase(this.ormClient);
  }
}