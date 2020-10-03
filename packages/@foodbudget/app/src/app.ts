import express from 'express';
import loaders from './loaders';
import config from './config';
import serviceManager from './serviceManager';

(async () => {
  const app = express();
  await loaders({ app, config, serviceManager: serviceManager() });

  app.listen(config.api.port, () => console.log(`App is now running at port ${config.api.port}`));
})();
