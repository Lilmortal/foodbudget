import { Application } from 'express';
import { ServiceManager } from '../serviceManager';

export interface LoaderParams {
    app: Application;
    serviceManager: ServiceManager;
}
