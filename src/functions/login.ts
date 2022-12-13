import { PrismaClient } from "@prisma/client";
import { getAcadamicData } from "./getAcadamicData";

export const login = async (
  userId: number,
  prisma: PrismaClient,
  cb?: () => void
) => {
  const { muPassword, enrollmentNumber } = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  const res = await fetch(
    "https://www.marwadieducation.edu.in/MarwadiWebAPI/jwsUserCredential.aspx",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `RequestType=GetLogin&UserName=${enrollmentNumber}&Password=${muPassword}`,
    }
  );

  const data = await res.json();

  console.log(data);
  console.log(userId);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      jws: data[0].ObjSec,
    },
  });

  await getAcadamicData(userId, prisma);

  if (cb) {
    cb();
  }
};
