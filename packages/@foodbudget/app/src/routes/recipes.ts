import { Router } from 'express';
import { ServiceManager } from '../serviceManager';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const recipesRoutes = (app: Router, manager: ServiceManager): void => {
  app.get('/recipes', (_req, res) => {
    // manager.recipeServices.save();
    res.status(200).send('Recipes');
  });
};

export default recipesRoutes;
