import { Mailer } from '@foodbudget/email';
import { EmailError, StatusError } from '@foodbudget/errors';
import * as utils from './handleError';

const getMockEmailer = (implementation?: Partial<Mailer>) => jest.fn<Mailer, []>(() => ({
  service: 'gmail',
  port: 5432,
  secure: false,
  auth: {
    user: 'user',
    pass: 'pass',
  },
  verify: async () => true,
  send: async () => true,
  ...implementation,
}))();

describe('error handling', () => {
  it('should handle email failed to send', async () => {
    const mockEmailer = getMockEmailer({
      send: async () => {
        throw new Error();
      },
    });

    const spiedHandleError = jest.spyOn(utils, 'handleError');
    await utils.handleError({
      err: new StatusError(500, 'error'),
      emailer: mockEmailer,
    });

    expect(spiedHandleError).toBeCalledTimes(2);
    expect(spiedHandleError.mock.calls).toEqual([
      [{ err: new StatusError(500, 'error'), emailer: mockEmailer }],
      [
        {
          err: new EmailError('failed to send an error report email.'),
          emailer: mockEmailer,
        },
      ],
    ]);
  });
});
