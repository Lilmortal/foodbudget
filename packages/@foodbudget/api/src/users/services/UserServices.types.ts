export interface GoogleLoginRequest {
    googleId: string;
  }

export interface FacebookLoginRequest {
    facebookId: string;
  }
export interface AccountLoginRequest {
    email: string;
    password: string;
  }

export type LoginRequest = GoogleLoginRequest | FacebookLoginRequest | AccountLoginRequest;
