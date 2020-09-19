import dotenv from "dotenv";
import scrapedWebsiteInfo from "./scrapedWebsiteInfo";

const envFound = dotenv.config();

if (!envFound) {
  throw new Error(".env file is missing.");
}

export default {
  agenda: {
    url: process.env.agendaUrl || "mongodb://admin:pass@127.0.0.1:27017/admin",
  },
  scrapedWebsiteInfo: [...scrapedWebsiteInfo],
};
