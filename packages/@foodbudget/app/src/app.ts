import { PrismaClient } from "@prisma/client";
import jobs from "./jobs";
import { createRecipeRepository } from "./repository/recipe";

(async () => {
  const prisma = new PrismaClient({ log: ["query"] });

  try {
    const recipeRepository = createRecipeRepository(prisma);
    jobs({ recipeRepository });
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
})();
