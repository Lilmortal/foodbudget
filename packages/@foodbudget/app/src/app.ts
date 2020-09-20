import { PrismaClient } from "@prisma/client";
import config from "./config";
import jobs from "./jobs";
import { createRecipeRepository } from "./repository/recipe";
import { Emailer, Service } from "./services/email";

(async () => {
  const prisma = new PrismaClient({ log: ["query"] });

  try {
    const recipeRepository = createRecipeRepository(prisma);

    const emailer = Emailer({
      service: config.email.service as Service,
      auth: { user: config.email.user, pass: config.email.password },
    });
    jobs({ recipeRepository, emailer });
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
})();
