import { PrismaClient } from "@prisma/client";
import { Attendance } from "../types";
import { parse } from "node-html-parser";
import { saveAttendanceToDB } from "./saveAttendanceToDB";
import { login } from "./login";

export const getAttendance = async (userId: number, prisma: PrismaClient) => {
  const { jws, grNumber } = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!jws) {
    return login(userId, prisma, () => getAttendance(userId, prisma));
  }

  const res = await fetch(
    `https://student.marwadiuniversity.ac.in:553/Attendance.aspx?a=${grNumber}&b=U1&c=${encodeURI(
      jws
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
        date: new Date(date.querySelector(".date-inr").innerText),
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

    await saveAttendanceToDB(prisma, data, userId);
  }
};
