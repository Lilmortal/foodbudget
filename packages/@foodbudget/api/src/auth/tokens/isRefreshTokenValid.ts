import { RefreshToken } from './Token.types';

// eslint-disable-next-line @typescript-eslint/ban-types
const isRefreshTokenValid = (token: string | object): token is RefreshToken => typeof token === 'object'
&& (token as RefreshToken).userId !== undefined && typeof (token as RefreshToken).userId === 'string';

export default isRefreshTokenValid;
