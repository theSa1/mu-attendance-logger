import { PrismaClient } from "@prisma/client";
import express from "express";
import { login } from "./functions/login";

const port = process.env.PORT || 3000;

export const runServer = async (prisma: PrismaClient) => {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    if (req.headers.authorization === process.env.SERVER_SEC) {
      res.send("Authorized!");
    } else {
      res.send("Unauthorized");
    }
  });

  app.get("/attendance", async (req, res) => {
    const { userId } = req.query;

    if (typeof userId !== "number") return res.send("No user id provided");

    if (req.headers.authorization === process.env.SERVER_SEC) {
      const attendance = await prisma.attendance.findMany({
        where: {
          userId: userId,
        },
        include: {
          subject: true,
        },
      });

      res.send(attendance);
    } else {
      res.send("Unauthorized");
    }
  });

  app.post("/add-user", async (req, res) => {
    if (req.headers.authorization === process.env.SERVER_SEC) {
      const { name, enrollmentNumber, grNumber, muPassword } = req.body;

      console.log(req.body);

      if (
        typeof name !== "string" ||
        typeof enrollmentNumber !== "number" ||
        typeof grNumber !== "number" ||
        typeof muPassword !== "string"
      )
        return res.send("Invalid data");

      const user = await prisma.user.create({
        data: {
          name,
          enrollmentNumber,
          grNumber,
          muPassword,
        },
      });

      await login(user.id, prisma);

      res.send("Authorized!");
    } else {
      res.send("Unauthorized");
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
