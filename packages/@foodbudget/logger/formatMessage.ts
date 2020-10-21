const isSensitive = (key: string) => /.*password*/.test(key) || /.*email*/.test(key);

const isObject = (info: unknown): info is Record<string, unknown> => typeof info === 'object' && info !== null;

const mask = (info: Record<string, unknown>) => {
  const maskedMessage: Record<string, unknown> = {};

  Object.entries(info).forEach(([key, values]) => {
    if (key === 'message' || key === 'level' || key === 'sessionId') {
      return;
    }

    if (isObject(values)) {
      maskedMessage[key] = mask(values);
    } else if (isSensitive(key)) {
      maskedMessage[key] = '*****';
    } else {
      maskedMessage[key] = values;
    }
  });

  return maskedMessage;
};

const formatMessage = (info: Record<string, unknown>): string => {
  const maskedMessage = mask(info);
  const query = Object.keys(maskedMessage).length > 0 && maskedMessage;
  const { sessionId } = info;

  if (sessionId) {
    const formattedMessage = {
      sessionId,
      ...query,
    };

    return `${info.message}\n${JSON.stringify(formattedMessage, null, 2)}`;
  }

  return `${info.message}${query ? `\n${JSON.stringify(query, null, 2)}` : ''}`;
};

export default formatMessage;
