export interface ApiConfig {
  prefix: string;
  port: number;
}

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
}

export interface Config {
  api: ApiConfig;
  google: GoogleConfig;
}
