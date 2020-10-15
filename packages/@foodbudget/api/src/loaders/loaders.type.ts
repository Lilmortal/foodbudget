import { Application } from 'express';
import { Config } from '../config';
import { ServiceManager } from '../serviceManager';

export interface LoaderParams {
    app: Application;
    serviceManager: ServiceManager;
    config: Config;
}
