export default interface MailerInterface {
  send(to: string, subject: string, body: string): Promise<any>;
}