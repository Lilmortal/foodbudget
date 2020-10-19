import { AuthRefreshTokenPayload } from './Token.types';

const isAuthRefreshToken = (token: unknown): token is AuthRefreshTokenPayload => typeof token === 'object'
&& (token as AuthRefreshTokenPayload).userId !== undefined && typeof (token as AuthRefreshTokenPayload).userId === 'string';

export default isAuthRefreshToken;
