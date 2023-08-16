import TokenGenerator from "../../domain/TokenGenerator";
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

    if(!user) throw new Error('User does not exists');
    if(!user.password.check(input.password)) throw new Error('Wrong password');
    if(!user.isActive) throw new Error('Inactive account');

    const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');
    const token = tokenGenerator.sign(user);
    
    return { token };
  }
}