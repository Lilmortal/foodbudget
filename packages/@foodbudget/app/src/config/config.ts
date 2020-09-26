import dotenv from "dotenv";
import { Service } from "../services/email";
import { Config } from "./config.types";
import scrapedWebsiteInfo from "./scrapedWebsiteInfo";

const envFound = dotenv.config();

if (!envFound) {
  throw new Error(".env file is missing.");
}

const isService = (service: string | undefined): service is Service => {
  if ((["gmail"] as Service[]).includes(service as Service)) {
    return true;
  }
  throw new Error("EMAILER_SERVICE environment variable is not a valid Service type.");
};

const config: Config = {
  agenda: {
    url: process.env.AGENDA_URL || "mongodb://admin:pass@127.0.0.1:27017/admin",
  },
  email: {
    service: isService(process.env.EMAILER_SERVICE)
      ? process.env.EMAILER_SERVICE
      : "gmail",
    user: process.env.EMAILER_USER || "",
    password: process.env.EMAILER_PASSWORD || "",
  },
  scrapedWebsiteInfo: [...scrapedWebsiteInfo],
  headlessBrowser: {
    retries: Number(process.env.HEADLESS_BROWSER_RETRIES) || 3,
  },
};

export default config;
