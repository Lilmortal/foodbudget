import dotenv from "dotenv";
import scrapedWebsiteInfo from "./scrapedWebsiteInfo";

const envFound = dotenv.config();

if (!envFound) {
  throw new Error(".env file is missing.");
}

export default {
  agenda: {
    url: process.env.AGENDA_URL || "mongodb://admin:pass@127.0.0.1:27017/admin",
  },
  email: {
    service: process.env.EMAILER_SERVICE || "gmail",
    user: process.env.EMAILER_USER || "",
    password: process.env.EMAILER_PASSWORD || "",
  },
  scrapedWebsiteInfo: [...scrapedWebsiteInfo],
};
