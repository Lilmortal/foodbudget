import mask from './mask';

describe('mask', () => {
  it('should not mask a non sensitive object', () => {
    const message = { message: 'message', user: 'test', age: 43 };

    const result = mask(message);

    expect(result).toEqual('message\n{"user":"test","age":43}');
  });

  it('should hide mask password', () => {
    const message = { message: 'message', user: 'test', password: 'password' };

    const result = mask(message);

    expect(result).toEqual('message\n{"user":"test","password":"*****"}');
  });
});
