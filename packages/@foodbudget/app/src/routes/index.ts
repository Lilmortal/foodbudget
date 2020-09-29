import { Router } from 'express';
import recipes from './recipes';

const routes = Router();

recipes(routes);

export default routes;
