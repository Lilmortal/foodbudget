import createEmailer from '@foodbudget/email';
import logger from '@foodbudget/logger';
import config from './config';
import AppError from './AppError';

export default class ErrorHandler {
    static handleError = async (err: Error): Promise<void> => {
      logger.error('error exception', err);
      if (config.env === 'PROD') {
        const emailer = await createEmailer();
        emailer.send({
          from: config.email.from,
          to: config.email.to,
          subject: 'Error',
          // TODO
          text: err.message,
        });
      }
    };

    static isOperational = (err: Error): boolean => {
      if (err instanceof AppError) {
        return err.isOperational;
      }
      return false;
    };
}

process.on('unhandledRejection', (err) => {
  throw err;
});

process.on('uncaughtException', (err) => {
  ErrorHandler.handleError(err);

  if (!ErrorHandler.isOperational(err)) {
    process.exit(1);
  }
});
