import puppeteer from "puppeteer";
import { PrismaClient } from "@prisma/client";
import Agenda from "agenda";

(async () => {
  const prisma = new PrismaClient({ log: ["query"] });
  try {
    // await prisma.users.create({
    //   data: {
    //     username: "username2",
    //     password: "password",
    //     nickname: "test",
    //   },
    // });
    // console.log("added");

    const mongoConnectionString = "mongodb://admin:pass@127.0.0.1:27017/admin";

    const agenda = new Agenda({ db: { address: mongoConnectionString } });
    agenda.define("test", async () => console.log("wee"));

    await agenda.start();
    await agenda.every("5 seconds", "test");
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
})();
