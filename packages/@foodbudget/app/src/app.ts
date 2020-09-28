import { PrismaClient } from '@prisma/client';
import express from 'express';
import config from './config';
import jobs from './jobs';
import { Recipe, RecipeRepository } from './repository/recipe';
import { Emailer, EmailError, Mailer } from './services/email';
import { Repository, RepositoryError } from './repository';
import loaders from './loaders';
import { StatusError } from './utils/errors';

let emailer: Mailer | undefined;
(async () => {
  try {
    emailer = await Emailer.create({
      service: config.email.service,
      auth: { user: config.email.user, pass: config.email.password },
    });
  } catch (err) {
    throw new EmailError(err);
  }

  let recipeRepository: Repository<Recipe>;
  try {
    const prisma = new PrismaClient({ log: ['query'] });

    recipeRepository = new RecipeRepository(prisma);
  } catch (err) {
    throw new RepositoryError(err);
  }

  // await jobs({ recipeRepository, emailer });

  const app = express();
  await loaders({ app, config });

  app.listen(config.api.port, (err: Error) => {
    console.log(`Server is up and running at port ${config.api.port}`);
    if (err) {
      throw new StatusError(500, err.message);
    }
  });
})();
