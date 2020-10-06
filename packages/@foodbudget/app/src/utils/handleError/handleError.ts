import {
  CronJobError, EmailError, RepositoryError, ScrapeError, StatusError,
} from '@foodbudget/errors';

const isStatusError = (err: unknown): err is StatusError => (err as StatusError).status !== undefined;

const handleError = (err: unknown): StatusError => {
  if (isStatusError(err)) {
    if (err instanceof ScrapeError) {
      console.log('Scraping error. \n', err.message);
      return err;
    }

    if (err instanceof CronJobError) {
      console.log('Job scheduler error. \n', err.message);
      return err;
    }

    if (err instanceof RepositoryError) {
      console.log('Database error. \n', err.message);
      return err;
    }

    if (err instanceof EmailError) {
      console.log('Email service error. \n', err.message);
      return err;
    }

    if (err instanceof StatusError) {
      console.log(err.message);
      return err;
    }
  } else if (err instanceof Error) {
    console.log(err.message);
    return new StatusError(500, err.message);
  }
  console.log(err);
  return new StatusError(500, `${err}`);
};

export default handleError;
