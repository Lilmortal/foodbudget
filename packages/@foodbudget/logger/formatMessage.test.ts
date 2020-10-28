import stripAnsi from 'strip-ansi';
import formatMessage from './formatMessage';

describe('formatMessage', () => {
  it('should format the message with no queries', () => {
    const message = {
      message: 'message',
    };

    const result = stripAnsi(formatMessage(message));

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
      message: 'message',
      query: {
        data: {
          moreData: {
            food: 'pork',
          },
        },
        age: 43,
      },
    };

    const result = stripAnsi(formatMessage(message));

    expect(result).toEqual(`${message.message}\n${JSON.stringify(formattedMessage, null, 2)}`);
  });

  it('should mask sensitive properties', () => {
    const message = {
      message: 'message', user: 'test', password: 'password',
    };

    const formattedMessage = {
      message: 'message',
      query: { user: 'test', password: '*****' },
    };

    const result = stripAnsi(formatMessage(message));

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
      message: 'message',
      query: {
        object: {
          moreObject: {
            password: '*****',
            name: 'name',
          },
        },
      },
    };

    const result = stripAnsi(formatMessage(message));

    expect(result).toEqual(`${message.message}\n${JSON.stringify(formattedMessage, null, 2)}`);
  });

  it('should format an object with session ID', () => {
    const message = {
      sessionId: 'sessionId', message: 'message', user: 'test', password: 'password',
    };

    const formattedMessage = {
      message: 'message',
      sessionId: 'sessionId',
      query: { user: 'test', password: '*****' },
    };

    const result = stripAnsi(formatMessage(message));

    expect(result).toEqual(`${message.message}\n${JSON.stringify(formattedMessage, null, 2)}`);
  });

  it('should format a message with session ID and no queries', () => {
    const message = {
      sessionId: 'sessionId', message: 'message',
    };

    const formattedMessage = {
      message: 'message',
      sessionId: 'sessionId',
    };

    const result = stripAnsi(formatMessage(message));

    expect(result).toEqual(`${message.message}\n${JSON.stringify(formattedMessage, null, 2)}`);
  });
});
