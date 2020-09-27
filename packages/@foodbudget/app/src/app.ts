import { PrismaClient } from "@prisma/client";
import config from "./config";
import jobs from "./jobs";
import { Recipe, RecipeRepository } from "./repository/recipe";
import { RepositoryError } from "./repository/RepositoryError";
import { Emailer, EmailError } from "./services/email";
import { handleError } from "./app.utils";
import { Mailer } from "./services/email/Emailer.types";
import { Repository } from "./repository/types";
import { StatusError } from "./shared/errors";

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
    const prisma = new PrismaClient({ log: ["query"] });

    recipeRepository = new RecipeRepository(prisma);
  } catch (err) {
    throw new RepositoryError(err);
  }

  await jobs({ recipeRepository, emailer });
})().catch(async (err) => await handleError({ err, emailer }));
