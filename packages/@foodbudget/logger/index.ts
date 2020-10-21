import { createLogger, format, transports } from 'winston';
import config from './config';
import formatMessage from './formatMessage';

const loggerFormat = format.combine(
  format((info) => ({ ...info, level: info.level.toUpperCase(), message: formatMessage(info) }))(),
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.align(),
  format.splat(),
  format.json(),
  format.errors({ stacks: true }),
  format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`),
);

const logger = createLogger({
  level: 'info',
  silent: config.env === 'test',
  transports: [
    new transports.Console({
      format: loggerFormat,
    }),
  ],
  // Let error packages handle uncaught exceptions
  exitOnError: false,
});

if (config.env !== 'production') {
  logger.level = 'debug';
}

export default logger;
