import TokenGenerator from "../../domain/TokenGenerator";
import { CustomError } from "../../infra/errors/CustomError";
import UserRepository from "../respository/UserRepository";

type Input = {
  email: string,
  password: string
}

type Output = {
  token: string
}

export default class Login {
  constructor(private userRepository: UserRepository) { }

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.get(input.email);

    if(!user) throw new CustomError('User does not exists', 400);
    if(!user.password.check(input.password)) throw new CustomError('Wrong password', 400);
    if(!user.isActive) throw new CustomError('Inactive account', 400);

    const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');
    const token = tokenGenerator.sign(user);
    
    return { token };
  }
}