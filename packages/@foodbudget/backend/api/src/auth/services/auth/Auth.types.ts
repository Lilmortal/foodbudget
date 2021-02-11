export interface GoogleLoginRequest {
  googleId: string;
  email: string;
}

export interface FacebookLoginRequest {
  facebookId: string;
  email: string;
}

export interface AccountLoginRequest {
  email: string;
  password: string;
}

export type LoginRequest =
  | GoogleLoginRequest
  | FacebookLoginRequest
  | AccountLoginRequest;
