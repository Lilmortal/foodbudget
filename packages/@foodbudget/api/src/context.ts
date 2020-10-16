import { Request, Response } from 'express';
import serviceManager, { ServiceManager } from './serviceManager';
import config, { Config } from './config';

interface ContextParams {
    req: Request;
    res: Response;
}

export interface Context extends ContextParams {
    serviceManager: ServiceManager;
    config: Config;
}

const context = ({ req, res }: ContextParams): Context => ({
  serviceManager, req, res, config,
});

export default context;
