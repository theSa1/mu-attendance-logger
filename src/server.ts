import express from "express";
import { JsonDB } from "node-json-db";

const port = process.env.PORT || 3000;

export const runServer = async (db: JsonDB) => {
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
      if (await db.exists("/attendance")) {
        res.send(await db.getData("/attendance"));
      } else {
        res.send([]);
      }
    } else {
      res.send("Unauthorized");
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
