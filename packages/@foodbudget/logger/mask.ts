const isPrivate = (key: string) => /.*password*/.test(key) || /.*email*/.test(key);

const mask = (message: string): string => {
  try {
    const messageJson = JSON.parse(message);
    if (typeof messageJson === 'object') {
      const maskedMessage: Record<string, string | undefined> = {};
      Object.keys(messageJson).forEach((key) => {
        if (typeof messageJson[key] === 'object') {
          maskedMessage[key] = mask(messageJson[key]);
        }

        if (isPrivate(key)) {
          maskedMessage[key] = '*****';
        } else {
          maskedMessage[key] = messageJson[key];
        }
      });

      return JSON.stringify(maskedMessage);
    }
    return message;
  } catch {
    return message;
  }
};

export default mask;
