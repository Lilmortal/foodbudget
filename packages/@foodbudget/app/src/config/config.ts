import dotenv from "dotenv";
import { Service } from "../services/email";
import { Config } from "./config.types";
import scrapedWebsiteInfo from "./scrapedWebsiteInfo";

const env = dotenv.config();

if (env.error) {
  throw new Error(".env file is missing.");
}

const services = ["gmail", "smtp.ethereal.email"] as Service[];

const isService = (service: string): service is Service => {
  if (services.includes(service as Service)) {
    return true;
  }
  return false;
};

const validate = (config: Config) => {
  const errors = [];

  if (!config.agenda.url) {
    errors.push("AGENDA_URL is missing.");
  }

  if (!config.email.service) {
    errors.push("EMAIL_SERVICE is missing.");
  } else if (!isService(config.email.service)) {
    errors.push(
      `EMAIL_SERVICE is not a valid Service type. \n A valid Service type should look like one of the following: [${services.join(
        ", "
      )}]`
    );
  }

  if (!config.email.user) {
    errors.push("EMAIL_USER is missing.");
  }

  if (!config.email.password) {
    errors.push("EMAIL_PASSWORD is missing.");
  }

  if (!config.headlessBrowser.retries) {
    errors.push("HEADLESS_BROWSER_RETRIES is missing.");
  }

  if (errors.length > 0) {
    console.error(
      "There are errors attempting to retrieve environment variables."
    );

    console.error(
      "Please add them in the .env file if you forget to add them in."
    );

    console.error(errors.map(error => `* ${error}`).join("\n"));

    return false;
  }

  return true;
};

const config: Config = {
  agenda: {
    url: process.env.AGENDA_URL || "",
  },
  email: {
    service: (process.env.EMAIL_SERVICE as Service) || "",
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
  },
  scrapedWebsiteInfo: [...scrapedWebsiteInfo],
  headlessBrowser: {
    retries: Number(process.env.HEADLESS_BROWSER_RETRIES),
  },
};

if (!validate(config)) {
  process.exit(0);
}

export default config;
