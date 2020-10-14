import { sign } from 'jsonwebtoken';
import { Token } from './Token.types';

// eslint-disable-next-line @typescript-eslint/ban-types
const createToken = <P extends object>({ payload, secret, expireTime }: Token<P>): string => {
  const token = sign(payload, secret, { expiresIn: expireTime });
  return token;
};

export default createToken;
