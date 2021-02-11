import { AppError } from '@foodbudget/errors';
import { emailArg } from './emailArg';

describe('email scalar', () => {
  it('should verify email is in invalid format', () => {
    expect(
      () =>
        emailArg.value.parseValue &&
        emailArg.value.parseValue('invalidemail.com'),
    ).toThrowError(AppError);
  });

  it('should verify email is valid', () => {
    const isValid =
      emailArg.value.parseValue && emailArg.value.parseValue('VALID@GMAIL.COM');

    expect(isValid).toEqual('valid@gmail.com');
  });
});
