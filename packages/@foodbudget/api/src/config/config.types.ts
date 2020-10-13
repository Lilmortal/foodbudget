export interface ApiConfig {
  prefix: string;
  port: number;
}

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
}

export interface TokenContentConfig {
  secret: string;
  expireTime: string;
}
export interface TokenConfig {
  access: TokenContentConfig;
  refresh: TokenContentConfig;
}

export interface Config {
  api: ApiConfig;
  google: GoogleConfig;
  token: TokenConfig;
}
