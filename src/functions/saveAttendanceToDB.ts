import { Attendance } from "../types";
import { PrismaClient } from "@prisma/client";

export const saveAttendanceToDB = async (
  prisma: PrismaClient,
  data: Attendance,
  userId: number
) => {
  for await (const attendance of data) {
    const isCopy = await prisma.attendance.findFirst({
      where: {
        date: attendance.date,
        subject: attendance.subject,
        type: attendance.type,
        faculty: attendance.faculty,
        userId: userId,
      },
    });

    if (isCopy) {
      return;
    }

    await prisma.attendance.create({
      data: {
        date: attendance.date,
        subject: attendance.subject,
        status: attendance.status,
        time: attendance.time,
        type: attendance.type,
        faculty: attendance.faculty,
        firstDiscoverd: attendance.firstDiscovered,
        userId: userId,
      },
    });
  }
};
