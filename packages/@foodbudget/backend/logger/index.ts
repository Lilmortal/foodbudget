import { createLogger, format, transports } from 'winston';
import colors from 'colors';
import config from './config';
import formatMessage from './formatMessage';

const colorLevel = (level: string) => {
  switch (level) {
    case '[ERROR]':
      return colors.red(level);
    case '[WARN]':
      return colors.yellow(level);
    case '[INFO]':
      return colors.green(level);
    case '[DEBUG]':
      return colors.green(level);
    default:
      return level;
  }
};

const loggerFormat = format.combine(
  format((info) => ({
    ...info,
    level: info.level.toUpperCase(),
    message: formatMessage(info, config.env),
  }))(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.align(),
  format.splat(),
  format.json(),
  format.errors({ stacks: true }),
  format.printf(
    (info) =>
      `${info.timestamp} ${colorLevel(`[${info.level}]`)} ${info.message}`,
  ),
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
