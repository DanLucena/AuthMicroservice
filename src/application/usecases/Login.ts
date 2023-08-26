import InMemoryConnection from "../../infra/database/InMemoryConnection";
import TokenGenerator from "../../domain/TokenGenerator";
import { CustomError } from "../../infra/errors/CustomError";
import UserRepository from "../respository/UserRepository";
import RepositoryFactoryInterface from "../respository/RepositoryFactory";

type Input = {
  email: string,
  password: string
}

type Output = {
  userId: string,
  token: string,
  refreshToken: string
}

export default class Login {
  private REFRESH_TOKEN_DURATION_IN_SECONDS = 2_591_950;
  private userRepository: UserRepository;

  constructor(private repositories: RepositoryFactoryInterface, private redis: InMemoryConnection) {
    this.userRepository = this.repositories.userRepository();
  }

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.get(input.email);

    if(!user) throw new CustomError('User does not exists', 400);
    if(!user.password.check(input.password)) throw new CustomError('Wrong password', 400);
    if(!user.isActive) throw new CustomError('Inactive account', 400);

    const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');
    const refreshToken = tokenGenerator.sign({ id: user.id, email: user.email }, '30d');
    const token = tokenGenerator.sign({ email: user.email.value });

    await this.redis.set(user.id, refreshToken);
    await this.redis.expires(user.id, this.REFRESH_TOKEN_DURATION_IN_SECONDS);
    
    return { userId: user.id, token, refreshToken };
  }
}