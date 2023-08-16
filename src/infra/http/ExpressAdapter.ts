import express, { Request, Response } from 'express';
import HttpServer, { ReturnType } from "./HttpServer";
import path from 'node:path';
import cors from 'cors';

export default class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  on(method: string, url: string, callback: Function, returnType: ReturnType = { type: 'JSON' }): void {
    this.app[method](url, async function (req: Request, res: Response) {
			try {
				const output = await callback(req.params, req.body, req.headers);
        if(returnType.type == 'JSON') {
          res.json(output);
        } else {
          const file = path.join(__dirname, `../../application/views/${output}`);
          res.sendFile(file);
        }
			} catch (e: any) {
        if(returnType.type == 'JSON') {
          res.status(422).json({ message: e.message });
        } else {
          const file = path.join(__dirname, `../../application/views/error.html`);
          res.sendFile(file);
        }
			}
		});
  }

  listen(port: number): void {
    this.app.listen(port);
  }
}