import { AppError } from '@foodbudget/errors';
import { Emailer } from './Emailer';

describe('emailer', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterEach(() => {
    jest.setTimeout(5000);
  });

  it('should send a mail', async () => {
    const emailer = await Emailer.createTestAccount();

    const url = await emailer.send({
      from: 'test@test.com',
      to: 'test@test.com',
      subject: 'Test',
      text: 'Text message',
      html: '<b>HTML</b>',
    });

    // If given a URL, it means the mail has been successfully sent.
    // We don't need to verify the content.
    expect(url).not.toBeUndefined();
  });

  it('should throw an AppError given invalid credentials', async () => {
    expect(
      Emailer.create({
        service: 'smtp.ethereal.email',
        auth: { user: 'fake user', pass: 'fake pass' },
      }),
    ).rejects.toThrowError(AppError);
  });
});
