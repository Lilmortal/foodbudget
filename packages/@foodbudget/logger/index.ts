import { createLogger, format, transports } from 'winston';
import colors from 'colors/safe';
import config from './config';
import formatMessage from './formatMessage';

const loggerFormat = format.combine(
  format.colorize({ all: true }),
  format((info) => ({ ...info, level: info.level.toUpperCase(), message: colors.red(formatMessage(info)) }))(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.align(),
  format.splat(),
  format.json(),
  format.errors({ stacks: true }),
  format.printf((info) => `${colors.red(info.timestamp)} [${info.level}] ${info.message}`),
);

const logger = createLogger({
  level: config.logLevel,
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
