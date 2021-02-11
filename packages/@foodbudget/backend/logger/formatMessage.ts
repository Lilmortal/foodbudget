import colors from 'colors';
import stripAnsi from 'strip-ansi';
import type { Env } from './config';

const isSensitive = (key: string) =>
  /.*password*/.test(key) || /.*email*/.test(key);

const isObject = (info: unknown): info is Record<string, unknown> =>
  typeof info === 'object' && info !== null;

const mask = (info: Record<string, unknown>, env?: Env) => {
  const maskedMessage: Record<string, unknown> = {};

  Object.entries(info).forEach(([key, values]) => {
    if (key === 'message' || key === 'level' || key === 'sessionId') {
      return;
    }

    if (isObject(values)) {
      maskedMessage[key] = mask(values, env);
    } else if (env === 'production' && isSensitive(key)) {
      maskedMessage[key] = '*****';
    } else {
      maskedMessage[key] = values;
    }
  });

  return maskedMessage;
};

const formatMessage = (info: Record<string, unknown>, env?: Env): string => {
  const maskedMessage = mask(info, env);
  const query = Object.keys(maskedMessage).length > 0 && maskedMessage;
  const { message, sessionId } = info;

  const formattedMessage = {
    message: stripAnsi(`${message}`),
    ...(!!sessionId && { sessionId }),
    ...(!!query && { query }),
  };

  if ((sessionId || query) && info.level !== 'error') {
    return `${colors.yellow(`${message}`) || ''}${
      formattedMessage ? `\n${JSON.stringify(formattedMessage, null, 2)}` : ''
    }`;
  }

  return `${message}`;
};

export default formatMessage;
