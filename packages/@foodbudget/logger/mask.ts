const isPrivate = (key: string) => /.*password*/.test(key) || /.*email*/.test(key);

const isObject = (info: unknown): info is Record<string, unknown> => typeof info === 'object'
&& info !== null && !Array.isArray(info);

const mask = (info: unknown): string => {
  const maskedMessage: Record<string, string | undefined> = {};
  if (isObject(info)) {
    Object.keys(info).forEach((key) => {
      if (key === 'message' || key === 'level') {
        return;
      }
      if (typeof info[key] === 'object' && !Array.isArray(info[key])) {
        maskedMessage[key] = mask(info[key]);
      }

      if (isPrivate(key)) {
        maskedMessage[key] = '*****';
      } else {
        maskedMessage[key] = info[key] as string | undefined;
      }
    });
    const query = Object.keys(maskedMessage).length > 0 ? `\n${JSON.stringify(maskedMessage)}` : '';

    return `${info.message}${query}`;
  }

  return info as string;
};

export default mask;
