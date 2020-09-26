import { Config } from "../../config";

export interface Job {
  readonly interval: number | string;
  readonly definition: string;
  start(config: Config): Promise<void>;
}
