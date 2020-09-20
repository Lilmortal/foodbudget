import nodeMailer from "nodemailer";

export interface EmailerAuth {
  user: string;
  pass: string;
}

export type Service = "gmail";

export interface EmailerConnections {
  service: Service;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: EmailerAuth;
}

export interface EmailerSendInfo {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

export interface EmailerApi {
  send(sendInfo: EmailerSendInfo): Promise<void>;
}

export const Emailer = ({
  service,
  host,
  port = 587,
  secure = false,
  auth,
}: EmailerConnections): EmailerApi => {
  const transporter = nodeMailer.createTransport({
    service,
    host,
    port,
    secure,
    auth,
  });

  return {
    send: async ({ from, to, subject, text, html }: EmailerSendInfo) => {
      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      console.log("Message sent");
    },
  };
};
