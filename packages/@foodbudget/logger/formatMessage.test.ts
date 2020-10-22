import formatMessage from './formatMessage';

describe('formatMessage', () => {
  it('should format the message with no queries', () => {
    const message = {
      message: 'message',
    };

    const result = formatMessage(message);

    expect(result).toEqual(`${message.message}`);
  });

  it('should format the message with queries', () => {
    const message = {
      message: 'message',
      data: {
        moreData: {
          food: 'pork',
        },
      },
      age: 43,
    };

    const formattedMessage = {
      data: {
        moreData: {
          food: 'pork',
        },
      },
      age: 43,
    };

    const result = formatMessage(message);

    expect(result).toEqual(`${message.message}\n${JSON.stringify(formattedMessage, null, 2)}`);
  });

  it('should mask sensitive properties', () => {
    const message = {
      message: 'message', user: 'test', password: 'password',
    };

    const formattedMessage = {
      user: 'test', password: '*****',
    };

    const result = formatMessage(message);

    expect(result).toEqual(`${message.message}\n${JSON.stringify(formattedMessage, null, 2)}`);
  });

  it('should mask a deep nested object', () => {
    const message = {
      message: 'message',
      object: {
        moreObject: {
          password: 'test',
          name: 'name',
        },
      },
    };

    const formattedMessage = {
      object: {
        moreObject: {
          password: '*****',
          name: 'name',
        },
      },
    };

    const result = formatMessage(message);

    expect(result).toEqual(`${message.message}\n${JSON.stringify(formattedMessage, null, 2)}`);
  });

  it('should format an object with session ID', () => {
    const message = {
      sessionId: 'sessionId', message: 'message', user: 'test', password: 'password',
    };

    const formattedMessage = {
      sessionId: 'sessionId', user: 'test', password: '*****',
    };

    const result = formatMessage(message);

    expect(result).toEqual(`${message.message}\n${JSON.stringify(formattedMessage, null, 2)}`);
  });

  it('should format a message with session ID and no queries', () => {
    const message = {
      sessionId: 'sessionId', message: 'message',
    };

    const formattedMessage = {
      sessionId: 'sessionId',
    };

    const result = formatMessage(message);

    expect(result).toEqual(`${message.message}\n${JSON.stringify(formattedMessage, null, 2)}`);
  });
});
