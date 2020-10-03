import { Express } from 'express-serve-static-core';
import { Config } from '../config';
import { ServiceManager } from '../serviceManager';

export interface LoaderParams {
    app: Express,
    config: Config,
    serviceManager: ServiceManager
}
