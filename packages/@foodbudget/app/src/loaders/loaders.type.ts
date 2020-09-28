import { Express } from 'express-serve-static-core';
import { Config } from '../config';

export interface LoaderParams {
    app: Express,
    config: Config
}
