import { PrismaClient } from '@prisma/client';
import config from './config';
import jobs from './jobs';
import { Recipe, RecipeRepository } from './repository/recipe';
import { Emailer, EmailError, Mailer } from './services/email';
import { handleError } from './app.utils';
import { Repository, RepositoryError } from './repository';

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

  await jobs({ recipeRepository, emailer });
})().catch(async (err) => handleError({ err, emailer }));
