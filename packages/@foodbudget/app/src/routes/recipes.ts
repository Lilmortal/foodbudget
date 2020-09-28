import { Router } from 'express';

const recipesRoutes = (app: Router): void => {
  app.get('/recipes', (req, res) => res.status(200).send('Recipes'));
};

export default recipesRoutes;
