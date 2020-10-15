import { Request, Response } from 'express';
import serviceManager, { ServiceManager } from './serviceManager';

interface ContextParams {
    req: Request;
    res: Response;
}

export interface Context extends ContextParams {
    serviceManager: ServiceManager
}

const context = ({ req, res }: ContextParams): Context => ({ serviceManager, req, res });

export default context;
