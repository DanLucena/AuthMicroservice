import MailerInterface from "./MailerInterface";
import nodemailer, { Transporter } from 'nodemailer';

export default class NodemailerAdapter implements MailerInterface {
  mailer: Transporter;

  constructor() { 
    this.mailer = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
      }
    });
  }

  async send(to: string, subject: string, body: string): Promise<any> { 
    const info = await this.mailer.sendMail({
      from: `"Auth Service" <${process.env.MAILER_USER}>`,
      to,
      subject,
      html: body
    });

    return info;
  }
}