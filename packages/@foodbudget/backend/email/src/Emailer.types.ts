export interface MailAuth {
  /**
   * Auth host email address.
   */
  user: string;
  /**
   * Auth host password.
   */
  pass: string;
}

export interface Mail {
  /**
   * Sender email address.
   */
  from: string;
  /**
   * A list of receiver email addresses.
   */
  to: string | string[];
  /** The title of the email. */
  subject: string;
  /**
   * The body content of the email in text format.
   */
  text: string;
  /**
   * The body content of the email in html format.
   */
  html?: string;
}

// When adding a new Service type, remember to update the validation in config.
export type Service = 'gmail' | 'smtp.ethereal.email';

export interface MailerParams {
  /**
   * Auth host service provider.
   */
  service: Service;
  /**
   * SMTP host.
   */
  host?: string;
  /**
   * SMTP port number, default to standard.
   */
  port?: number;
  /**
   * Whether this SMTP is secure, default to false.
   */
  secure?: boolean;
  /**
   * Authentication needed to allow sending emails.
   */
  auth: MailAuth;
}

export interface Mailer {
  /**
   * Send an email.
   * @param mail mail information that will be sent.
   */
  send(mail: Mail): Promise<string | boolean>;

  /**
   * Verify whether the connection is successful or not.
   */
  verify(): Promise<boolean>;
}
