import nodeMailer from 'nodemailer';
import util from 'util';
import MailTransporter from 'nodemailer/lib/mailer';
import SESTransport from 'nodemailer/lib/ses-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  Service, Mailer, MailAuth, MailerParams, Mail,
} from './Emailer.types';
import EmailError from './EmailError';

class Emailer implements Mailer {
  service: Service;

  host?: string;

  port: number;

  secure: boolean;

  auth: MailAuth;

  #transporter: MailTransporter;

  private constructor({
    service,
    host,
    port = 587,
    secure = false,
    auth,
  }: MailerParams) {
    this.service = service;
    this.host = host;
    this.port = port;
    this.secure = secure;
    this.auth = auth;

    this.#transporter = nodeMailer.createTransport({
      service,
      host,
      port,
      secure,
      auth,
    });
  }

  static async create({
    service, host, port, secure, auth,
  }: MailerParams): Promise<Mailer> {
    const emailer = new Emailer({
      service, host, port, secure, auth,
    });

    await emailer.verify();

    return emailer;
  }

  static async createTestAccount(): Promise<Mailer> {
    const testAccount = await nodeMailer.createTestAccount();
    const emailer = new Emailer({
      service: 'smtp.ethereal.email',
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    await emailer.verify();

    return emailer;
  }

  async verify(): Promise<boolean> {
    let isVerified = false;
    try {
      const promisifiedVerify = util.promisify<boolean>(
        this.#transporter.verify,
      );
      isVerified = await promisifiedVerify();
    } catch (err) {
      throw new EmailError(err.message || err);
    }
    return isVerified;
  }

  async send({
    from,
    to,
    subject,
    text,
    html,
  }: Mail): Promise<string | boolean> {
    const info:
      | SESTransport.SentMessageInfo
      | SMTPTransport.SentMessageInfo = await this.#transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });

    return nodeMailer.getTestMessageUrl(info);
  }
}

export default Emailer;
