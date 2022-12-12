import { PrismaClient } from "@prisma/client";

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

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      jws: data.ObjSec,
    },
  });

  if (cb) {
    cb();
  }
};
