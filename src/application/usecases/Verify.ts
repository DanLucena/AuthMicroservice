import InMemoryConnection from "../../infra/database/InMemoryConnection"
import TokenGenerator from "../../domain/TokenGenerator"
import { CustomError } from "../../infra/errors/CustomError"

type Input = {
  userId: string,
  token: string,
  refreshToken: string
}

type Output = {
  email: string,
  token?: string
}

export default class Verify {
  constructor(private redis: InMemoryConnection) { }

  public async execute(input: Input): Promise<Output> {
    const refreshToken = await this.redis.get(input.userId);
    const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');

    try {
      const result = tokenGenerator.verify(input.token) as any;
      
      return {
        email: result.email
      }
    } catch(error: any) {
      if(!refreshToken || refreshToken !== input.refreshToken) throw new CustomError('Unauthorized user', 401);
      const result = tokenGenerator.verify(refreshToken) as any;
      const newToken = tokenGenerator.sign({email: result.email});
      
      return {
        email: result.email.value,
        token: newToken
      }
    }
  }
}