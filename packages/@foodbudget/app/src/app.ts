import { PrismaClient } from "@prisma/client";
import config from "./config";
import jobs from "./jobs";
import { AgendaJobError } from "./jobs/agendaJob";
import { ScraperError } from "./jobs/scraper";
import { StatusError } from "./libs/errors";
import { RecipeRepository } from "./repository/recipe";
import { RepositoryError } from "./repository/RepositoryError";
import { Emailer, EmailError, Mail, Service } from "./services/email";

const main = async (emailer: Emailer) => {
  let prisma: PrismaClient;
  let recipeRepository: RecipeRepository;

  try {
    prisma = new PrismaClient({ log: ["query"] });

    recipeRepository = new RecipeRepository(prisma);
  } catch (err) {
    throw new RepositoryError(err);
  }

  try {
    await jobs({ recipeRepository, emailer });
  } finally {
    await prisma.$disconnect();
  }
};

const isStatusError = (err: any): err is StatusError =>
  err.status !== undefined;

const sendErrorEmail = (emailer: Emailer, subject: string, text: string) => {
  try {
    const mail: Pick<Mail, "from" | "to"> = {
      from: config.email.user,
      to: config.email.user,
    };

    emailer.send({ ...mail, subject: "Error", text: "" });
  } catch (err) {
    throw new EmailError(err);
  }
};

// @TODO: Work on this...
const handleError = (emailer: Emailer, err: any) => {
  if (isStatusError(err)) {
    if (err instanceof ScraperError) {
      console.log("Failed to scrape the website: \n", err.message);
      // sendErrorEmail(emailer, "Error", "");
    }

    if (err instanceof AgendaJobError) {
      console.log("Job ", err.message);
      // @TODO
    }

    if (err instanceof RepositoryError) {
      console.log("Repository: ");
      console.log(err.message);
      // @TODO
    }
  } else {
    throw new StatusError(500, err);
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
    if (err instanceof EmailError) {
      console.log("Failed to create email service", err);
    } else {
      console.log("Generic error", err);
      throw new StatusError(500, err);
    }
  }
})();
