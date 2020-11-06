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

export interface DbConfig {
  testUrl: string;
}

export type EnvConfig = 'production' | 'development' | 'test';

export interface Config {
  api: ApiConfig;
  db: DbConfig;
  google: SocialConfig;
  facebook: SocialConfig;
  token: TokenConfig;
  env: EnvConfig;
}
