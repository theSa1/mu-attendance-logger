import * as nodeSchedule from "node-schedule";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { runServer } from "./server";
import { getAttendance } from "./functions/getAttendance";

const prisma = new PrismaClient();

dotenv.config();

runServer(prisma);

nodeSchedule.scheduleJob("0 * * * *", async () => {
  await fetchAllAttendance();
});

const fetchAllAttendance = async () => {
  const users = await prisma.user.findMany();

  for await (const user of users) {
    await getAttendance(user.id, prisma);
  }
};
