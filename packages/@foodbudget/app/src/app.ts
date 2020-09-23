import { PrismaClient } from "@prisma/client";
import config from "./config";
import jobs from "./jobs";
import { ScraperError } from "./jobs/scraper/ScraperError";
import { StatusError } from "./libs/errors";
import { RecipeCreateFailedError } from "./repository/libs/errors";
import { RecipeRepository } from "./repository/recipe";
import { Emailer, Mail, Service } from "./services/email";

const main = async (emailer: Emailer) => {
  const prisma = new PrismaClient({ log: ["query"] });

  const recipeRepository = new RecipeRepository(prisma);

  try {
    await jobs({ recipeRepository, emailer });
  } finally {
    await prisma.$disconnect();
  }
};

const isStatusError = (err: any): err is StatusError =>
  err.status !== undefined;

const handleError = (emailer: Emailer, err: any) => {
  if (isStatusError(err)) {
    const mail: Pick<Mail, "from" | "to"> = {
      from: config.email.user,
      to: config.email.user,
    };

    if (err instanceof RecipeCreateFailedError) {
      console.log("Failed to save the recipe: ", err.message);
      emailer.send({ ...mail, subject: "Error", text: "" });
    }

    if (err instanceof ScraperError) {
      console.log("Failed to scrape the website: ", err.message);
      emailer.send({ ...mail, subject: "Error", text: "" });
    }
  } else {
    console.error("Error", err);
  }
};

(async () => {
  try {
    const emailer = new Emailer({
      service: config.email.service as Service,
      auth: { user: config.email.user, pass: config.email.password },
    });

    try {
      await main(emailer);
    } catch (err) {
      handleError(emailer, err);
    }
  } catch (err) {
    console.log("Failed to create email service", err);
  }
})();
