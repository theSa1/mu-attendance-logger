import { JsonDB } from "node-json-db";
import { Attendance } from "./types";

export const saveToDb = async (db: JsonDB, data: Attendance) => {
  if (!(await db.exists("/attendance"))) await db.push("/attendance", []);

  const prevData: Attendance = await db.getData("/attendance");

  const uniqueData = data.filter((data) => {
    const found = prevData.filter((prev) => {
      return (
        prev.date === data.date &&
        prev.time === data.time &&
        prev.subject === data.subject
      );
    });

    if (found.length == 0) return true;
    return false;
  });

  await db.push("/attendance", [...prevData, ...uniqueData], true);
};
