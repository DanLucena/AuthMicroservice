import User from "../../domain/User";

export default interface UserRepository {
  save(user: User): Promise<void>;
  get(email: string): Promise<User | null>;
  update(user: User, newData: Partial<any>): Promise<void>;
}