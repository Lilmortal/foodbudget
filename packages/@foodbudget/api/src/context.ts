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
  const token = req.headers.authorization;

  let userId: string | undefined;
  let scope: string[] | undefined;

  if (token) {
    const { authServices } = serviceManager;
    const decodedToken = authServices.decodeAccessToken(token);
    userId = decodedToken.userId;
    scope = decodedToken.scope;
  }
  return {
    serviceManager, req, res, userId, scope,
  };
};

export default context;
