import UserRepository from "../../application/respository/UserRepository";
import ORMConnection from "../database/ORMConnection";
import User from "../../domain/User";

export default class UserRepositoryDatabase implements UserRepository {
  client: any;

  constructor(private orm: ORMConnection) {
    this.client = this.orm.open();
  }

  async update(user: User, newData: Partial<User>): Promise<void> {
    await this.client.user.update({
      where: { email: user.email.getValue() },
      data: {
        ...newData as any
      }
    });
  }

  async save(user: User): Promise<void> {
    const client = await this.orm.open();

    await client.user.create({
      data: {
        id: user.id,
        email: user.email.getValue(),
        password: user.password.value,
        username: user.username
      }
    })
  }

  async get(email: string): Promise<User | null> {
    const user = await this.client.user.findUnique({
      where: { 
        email: email,
      },
    });

    if(!user) return user;
    return User.restore(user.id, user.email, user.password, user.username, user.isActive);
  }
}