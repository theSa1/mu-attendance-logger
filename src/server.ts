import { PrismaClient } from "@prisma/client";
import express from "express";

const port = process.env.PORT || 3000;

export const runServer = async (prisma: PrismaClient) => {
  const app = express();

  app.get("/", (req, res) => {
    if (req.headers.authorization === process.env.SERVER_SEC) {
      res.send("Authorized!");
    } else {
      res.send("Unauthorized");
    }
  });

  app.get("/attendance", async (req, res) => {
    if (req.headers.authorization === process.env.SERVER_SEC) {
      res.send("Authorized!");
    } else {
      res.send("Unauthorized");
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
