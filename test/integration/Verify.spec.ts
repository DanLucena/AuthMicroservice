import Verify from "../../src/application/usecases/Verify";
import TokenGenerator from "../../src/domain/TokenGenerator";
import User from "../../src/domain/User";

test("must validate a token", async () => {
  const user = User.create('validEmail@gmail.com', 'validPassword*123', 'Username')
  const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');
  const token = tokenGenerator.sign(user);
  const usecase = new Verify();
  const output = await usecase.execute({ token }); 

  expect(output.email).toBe('validEmail@gmail.com');
});

test("must raise with an invalid token", () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  const usecase = new Verify();

  expect(async () => await usecase.execute({ token })).rejects.toThrow();
});