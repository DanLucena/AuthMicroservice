import TokenGenerator from "../../domain/TokenGenerator"

type Input = {
  token: string
}

type Output = {
  email: string
}

export default class Verify {
  constructor() { }

  public async execute(input: Input): Promise<Output> {
    const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');
    const result = tokenGenerator.verify(input.token) as any;

    return { 
      email: result.email
    }
  }
}