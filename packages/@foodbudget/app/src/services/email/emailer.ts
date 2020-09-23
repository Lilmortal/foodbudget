import nodeMailer from "nodemailer";
import { default as MailTransporter } from "nodemailer/lib/mailer";

export interface MailAuth {
  user: string;
  pass: string;
}

export type Service = "gmail";

interface MailerConnections {
  service: Service;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: MailAuth;
}

interface MailerService {
  send(mail: Mail): Promise<void>;
}

interface Mailer extends MailerConnections, MailerService {}

export interface Mail {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

export class Emailer implements Mailer {
  service: Service;
  host?: string;
  port: number;
  secure: boolean;
  auth: MailAuth;
  #transporter: MailTransporter;

  constructor({
    service,
    host,
    port = 587,
    secure = false,
    auth,
  }: MailerConnections) {
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

  async send({ from, to, subject, text, html }: Mail) {
    await this.#transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent");
  }
}
