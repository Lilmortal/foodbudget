export interface ApiConfig {
  prefix: string;
  port: number;
}

export interface SocialConfig {
  clientId: string;
  clientSecret: string;
}

export interface TokenContentConfig {
  secret: string;
  expireTimeInMs: number;
}

export interface TokenConfig {
  access: TokenContentConfig;
  refresh: TokenContentConfig;
}

export interface Config {
  api: ApiConfig;
  google: SocialConfig;
  facebook: SocialConfig;
  token: TokenConfig;
}
