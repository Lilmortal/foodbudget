import puppeteer from "puppeteer";
import { PrismaClient } from "@prisma/client";

(async () => {
  const prisma = new PrismaClient({ log: ["query"] });
  try {
    await prisma.users.create({
      data: {
        username: "username2",
        password: "password",
        nickname: "test",
      },
    });
    console.log("added");
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
})();
