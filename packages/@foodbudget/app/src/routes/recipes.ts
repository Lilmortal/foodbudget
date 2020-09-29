import { Router } from 'express';

const recipesRoutes = (app: Router): void => {
  app.get('/recipes', (_req, res) => res.status(200).send('Recipes'));
};

export default recipesRoutes;
