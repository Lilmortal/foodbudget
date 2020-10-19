import { verify } from 'jsonwebtoken';

const getDecodedAuthRefreshToken = (
  refreshToken: string, refreshTokenSecret: string,
// eslint-disable-next-line @typescript-eslint/ban-types
): string | object => verify(refreshToken, refreshTokenSecret);

export default getDecodedAuthRefreshToken;
