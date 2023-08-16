import TokenGenerator from "../../src/domain/TokenGenerator";
import User from "../../src/domain/User";

test('Must create a token for user', () => {
  const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');
  const user = User.create('validEmail@gmail.com', 'validPassword*123', 'TestUser');
  const token = tokenGenerator.sign(user);

  expect(token).toBeDefined();
});

test('Must validate a real token', () => {
  const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZhbGlkRW1haWxAZ21haWwuY29tIiwiaWF0IjoxNjkxODY1MTIwMDAwLCJleHBpcmVzSW4iOjYwMDAwMH0.ieZTsAyysb2XH-GsEkErymMoFf_mz82F-LywGmOBY2w';

  expect(tokenGenerator.verify(token)).toBeTruthy();
});

test('Must validate a fake token', () => {
  const tokenGenerator = new TokenGenerator(process.env.JWT_TOKEN || 'token');
  const token = 'fake token';

  expect(() => tokenGenerator.verify(token)).toThrow();
});