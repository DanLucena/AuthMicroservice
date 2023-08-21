import UsecaseFactory from "../factory/UsecaseFactory";
import HttpServer from "./HttpServer";

export default class MainController {
  constructor(httpServer: HttpServer, usecases: UsecaseFactory) { 
    httpServer.on('post', '/user', async (params: any, body: any) => {
      const create = usecases.createUser(); 
      return await create.execute({email: body.email, password: body.password, username: body.username});
    });

    httpServer.on('post', '/auth', async (params: any, body: any) => {
      const login = usecases.login(); 
      return await login.execute({email: body.email, password: body.password});
    });

    httpServer.on('post', '/verify', async (params: any, body: any) => {
      const verify = usecases.verify();
      return await verify.execute({token: body.token});
    });

    httpServer.on('post', '/resent-mail-confirmation', async (params: any, body: any) => {
      const resendConfirmation = usecases.resendConfirmationMail();
      return await resendConfirmation.execute({ email: body.email });
    });

    httpServer.on('get', '/confirm/:token', async (params: any, body: any) => {
      const active = usecases.active();
      return await active.execute(params);
    }, { type: 'File' });

    httpServer.on('post', '/reset-password', async (params: any, body: any) => {
      const passwordReset = usecases.passwordReset();
      return await passwordReset.execute({ email: body.email });
    });

    httpServer.on('post', '/reset-password/validate-code', async (params: any, body: any) => {
      const validateCode = usecases.validatePasswordCode();
      return await validateCode.execute({ email: body.email, code: body.code });
    });

    httpServer.on('post', '/reset-password/change-password', async (params: any, body: any) => {
      const changePassword = usecases.changePassword();
      return await changePassword.execute({ email: body.email, password: body.password, token: body.token });
    });
  }
}