export interface Token<P> {
    payload: P;
    secret: string;
    expireTime: string;
}

export interface AuthRefreshTokenPayload {
    userId: string;
}

export interface RefreshToken {
    key: string;
    value: string;
}
