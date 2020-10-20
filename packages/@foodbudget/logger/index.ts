import { createLogger, format, transports } from 'winston';
import config from './config';
import mask from './mask';

const loggerFormat = format.combine(
  format((info) => ({ ...info, level: info.level.toUpperCase(), message: mask(info) }))(),
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
