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
        type: attendance.type,
        userId: userId,
        subject: {
          code: attendance.subject,
        },
      },
    });

    if (isCopy) {
      return;
    }

    const subject = await prisma.subject.findFirst({
      where: {
        code: attendance.subject,
        userId: userId,
      },
    });

    await prisma.attendance.create({
      data: {
        date: attendance.date,
        subjectId: subject.id,
        status: attendance.status,
        time: attendance.time,
        type: attendance.type,
        firstDiscoverd: attendance.firstDiscovered,
        userId: userId,
      },
    });
  }
};
