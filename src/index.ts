import { JsonDB, Config } from "node-json-db";
import { parse } from "node-html-parser";
import { Attendance } from "./types";
import { saveToDb } from "./saveToDb";
import * as nodeSchedule from "node-schedule";
import * as dotenv from "dotenv";
import { runServer } from "./server";

dotenv.config();

const db = new JsonDB(new Config("db", true, false, "/"));

runServer(db);

const main = async () => {
  if ((await db.exists("/initiated")) && (await db.getData("/initiated"))) {
    await getAttendance();
    nodeSchedule.scheduleJob("0 * * * *", async () => {
      await getAttendance();
    });
  } else {
    login(
      parseInt(process.env.EN_NUM),
      process.env.PASS,
      parseInt(process.env.GR)
    );
  }
};

const login = async (enNum: number, password: string, gr: number) => {
  const res = await fetch(
    "https://www.marwadieducation.edu.in/MarwadiWebAPI/jwsUserCredential.aspx",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `RequestType=GetLogin&UserName=${enNum}&Password=${password}`,
    }
  );

  const data = await res.json();

  await db.push("/session", data[0].ObjSec);
  await db.push("/gr", gr);
  await db.push("/initiated", true);

  main();
};

const getData = async () => {
  const session = await db.getData("/session");
  const gr = await db.getData("/gr");

  const res = await fetch(
    `https://www.marwadieducation.edu.in/MarwadiWebAPI/jwsUserPorfile.aspx`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `RequestType=GetUserData&UserId=${gr}&ObjSec=${encodeURI(
        session
      )}&UT=U1`,
    }
  );

  const data = await res.json();

  return data;
};

const getAttendance = async () => {
  const session = await db.getData("/session");
  const gr = await db.getData("/gr");

  const res = await fetch(
    `https://student.marwadiuniversity.ac.in:553/Attendance.aspx?a=${gr}&b=U1&c=${encodeURI(
      session
    )}`
  );

  console.log(res.url);

  const html = await res.text();

  const root = parse(html);

  const dates = root.querySelectorAll(".col-md-6");

  for await (const date of dates) {
    let data: Attendance = [];

    date.querySelectorAll("li").forEach((li) => {
      const subArray = li.querySelector("h5").innerText.split(" ");

      const subType = subArray[1].replace(/[(,)]/g, "");

      const sanitizeSubType = (subType: string) => {
        switch (subType) {
          case "L":
            return "Lab";
          case "T":
            return "Theory";
          case "W":
            return "Workshop";
          default:
            return "Other";
        }
      };

      const sanitizeStatus = (status: string) => {
        if (status.includes("Absent")) {
          return "Absent";
        } else if (status.includes("Present")) {
          return "Present";
        } else {
          return "Other";
        }
      };

      data.push({
        date: new Date(
          date.querySelector(".date-inr").innerText
        ).toLocaleDateString(),
        subject: subArray[0],
        status: sanitizeStatus(li.querySelector("div.status").innerText),
        time: li.querySelector("p.text-primary").innerText,
        type: sanitizeSubType(subType),
        faculty: li
          .querySelector("div.fac-status > p.text-primary")
          .innerText.replace(/[ ,\n]/g, ""),
        firstDiscovered: new Date(),
      });
    });

    await saveToDb(db, data);
  }
};

main();
