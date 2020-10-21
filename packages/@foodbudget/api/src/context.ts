import { Request, Response } from 'express';
import serviceManager, { ServiceManager } from './serviceManager';

interface ContextParams {
    req: Request;
    res: Response;
}

export interface Context extends ContextParams {
    serviceManager: ServiceManager;
    userId: string | undefined;
    scope: string[] | undefined;
}

const context = ({ req, res }: ContextParams): Context => {
  const header = req.headers.authorization;
  let userId: string | undefined;
  let scope: string[] | undefined;

  if (header) {
    const token = serviceManager.authServices.extractAccessToken(header);
    userId = token.userId;
    scope = token.scope;
  }

  return {
    serviceManager, req, res, userId, scope,
  };
};

export default context;
