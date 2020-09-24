import nodeMailer from "nodemailer";
import { default as MailTransporter } from "nodemailer/lib/mailer";
import {
  Service,
  Mailer,
  MailAuth,
  MailerConnections,
  Mail,
} from "./Emailer.types";

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
  }
}
