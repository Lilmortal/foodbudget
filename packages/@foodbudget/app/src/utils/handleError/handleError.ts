import { Mail, Mailer } from '@foodbudget/email';
import {
  CronJobError, EmailError, RepositoryError, ScrapeError, StatusError,
} from '@foodbudget/errors';

const isStatusError = (err: unknown): err is StatusError => (err as StatusError).status !== undefined;

interface HandleErrorParams {
  err: unknown;
  emailer?: Mailer;
}

// eslint-disable-next-line import/prefer-default-export
export const handleError = async ({ err, emailer }: HandleErrorParams): Promise<StatusError> => {
  const sendErrorEmail = async (
    subject: string,
    text: string,
    html?: string,
  ) => {
    try {
      // @TODO: Only activate this on prod env
      const mail: Pick<Mail, 'from' | 'to'> = {
        // from: config.email.user,
        // to: config.email.user,
        from: '',
        to: '',
      };

      await emailer?.send({
        ...mail, subject, text, html,
      });
    } catch {
      await handleError({
        err: new EmailError('failed to send an error report email.'),
        emailer,
      });
    }
  };

  if (isStatusError(err)) {
    if (err instanceof ScrapeError) {
      console.log('Scraping error. \n', err.message);
      await sendErrorEmail('Error', '');
      return err;
    }

    if (err instanceof CronJobError) {
      console.log('Job scheduler error. \n', err.message);
      await sendErrorEmail('Error', '');
      return err;
    }

    if (err instanceof RepositoryError) {
      console.log('Database error. \n', err.message);
      await sendErrorEmail('Error', '');
      return err;
    }

    if (err instanceof EmailError) {
      console.log('Email service error. \n', err.message);
      return err;
    }

    if (err instanceof StatusError) {
      console.log(err.message);
      await sendErrorEmail('Error', '');
      return err;
    }
  } else if (err instanceof Error) {
    console.log(err.message);
    await sendErrorEmail('Error', '');
    return new StatusError(500, err.message);
  }
  console.log(err);
  await sendErrorEmail('Error', '');
  return new StatusError(500, `${err}`);
};
