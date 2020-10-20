import mask from './mask';

describe('mask', () => {
  it('should not mask a non sensitive object', () => {
    const message = '{"user":"test","age":43}';

    const result = mask(message);

    expect(result).toEqual('{"user":"test","age":43}');
  });

  it('should hide mask password', () => {
    const message = '{"user":"test","password":"password"}';

    const result = mask(message);

    expect(result).toEqual('{"user":"test","password":"*****"}');
  });
});
