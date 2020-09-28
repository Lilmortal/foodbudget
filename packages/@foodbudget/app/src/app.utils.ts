import { AgendaJobError } from './jobs/agendaJob';
import { ScrapeError } from './jobs/scraper';
import { StatusError } from './shared/errors';
import { RepositoryError } from './repository';
import { EmailError, Mail, Mailer } from './services/email';

const isStatusError = (err: unknown): err is StatusError => (err as StatusError).status !== undefined;

interface HandleErrorParams {
  err: unknown;
  emailer?: Mailer;
}

// eslint-disable-next-line import/prefer-default-export
export const handleError = async ({ err, emailer }: HandleErrorParams): Promise<void> => {
  const sendErrorEmail = async (
    subject: string,
    text: string,
    html?: string,
  ) => {
    try {
      // @TODO: Add from and to back when we fixed most of the issues.
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
      return;
    }

    if (err instanceof AgendaJobError) {
      console.log('Job scheduler error. \n', err.message);
      await sendErrorEmail('Error', '');
      return;
    }

    if (err instanceof RepositoryError) {
      console.log('Database error. \n', err.message);
      await sendErrorEmail('Error', '');
      return;
    }

    if (err instanceof EmailError) {
      console.log('Email service error. \n', err.message);
      return;
    }

    if (err instanceof StatusError) {
      console.log(err.message);
      await sendErrorEmail('Error', '');
    }
  } else {
    if (err instanceof Error) {
      console.log(err.message);
      await sendErrorEmail('Error', '');
      return;
    }
    console.log(err);
    await sendErrorEmail('Error', '');
  }
};
