export interface Token<P> {
    payload: P;
    secret: string;
    expireTime: string;
}

export interface RefreshToken {
    userId: string;
}
