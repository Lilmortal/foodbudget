import { CookieOptions } from 'express';

export interface Token<P> {
    payload: P;
    secret: string;
    expireTimeInSeconds: number;
}

export type Scope = 'USER' | 'ADMIN';

export interface AccessTokenPayload {
    userId: string;
    scope: Scope[];
    expireTimeInUtc: string;
}

export interface RefreshTokenPayload {
    userId: string;
    expireTimeInUtc: string;
}

export interface AccessToken {
    name: string;
    value: AccessTokenPayload;
}

export interface RefreshToken {
    name: string;
    value: string;
    options: CookieOptions
}
