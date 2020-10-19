import { createLogger, format, transports } from 'winston';

const loggerFormat = format.combine(
  format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.align(),
  format.splat(),
  format.json(),
  format.simple(),
  format.errors({ stacks: true }),
  format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`),
);

const logger = createLogger({
  level: 'error',
  transports: [
    new transports.Console({
      format: loggerFormat,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

export default logger;
