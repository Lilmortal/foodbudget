import { Config } from "../../config";

export interface Job {
  start(config: Config): Promise<void>;
}
