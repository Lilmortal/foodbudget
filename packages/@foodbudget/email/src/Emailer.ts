import nodeMailer from 'nodemailer';
import util from 'util';
import MailTransporter from 'nodemailer/lib/mailer';
import SESTransport from 'nodemailer/lib/ses-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { AppError } from '@foodbudget/errors';
import {
  Mailer, MailerParams, Mail,
} from './Emailer.types';
import config from './config';

export class Emailer implements Mailer {
  private readonly transporter: MailTransporter;

  private constructor({
    service,
    host,
    port = 587,
    secure = false,
    auth,
  }: MailerParams) {
    this.transporter = nodeMailer.createTransport({
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
        this.transporter.verify,
      );
      isVerified = await promisifiedVerify();
    } catch (err) {
      throw new AppError({
        message: `Attempting to verify account failed:
      ${err.message || err}`,
        isOperational: true,
      });
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
    let info: SESTransport.SentMessageInfo | SMTPTransport.SentMessageInfo;

    try {
      info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
    } catch (err) {
      throw new AppError({ message: `Attempting to send mail failed: ${err.message || err}`, isOperational: true });
    }

    let messageUrl: string | boolean;

    try {
      messageUrl = nodeMailer.getTestMessageUrl(info);
    } catch (err) {
      throw new AppError({ message: `Attempting to get message url failed: ${err.message || err}`, isOperational: true });
    }

    return messageUrl;
  }
}

const createEmailer = (async (): Promise<Mailer> => Emailer.create(
  { service: config.email.service, auth: { user: config.email.user, pass: config.email.password } },
));

export default createEmailer;
