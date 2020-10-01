import { Router } from 'express';
import { ServiceManager } from '../serviceManager';
import recipes from './recipes';

const routes = (manager: ServiceManager): Router => {
  const router = Router();

  recipes(router, manager);

  return router;
};

export default routes;
