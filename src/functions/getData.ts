import { PrismaClient } from "@prisma/client";

export const getData = async (userId: number, prisma: PrismaClient) => {
  const { grNumber, jws } = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  const res = await fetch(
    `https://www.marwadieducation.edu.in/MarwadiWebAPI/jwsUserPorfile.aspx`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `RequestType=GetUserData&UserId=${grNumber}&ObjSec=${encodeURI(
        jws
      )}&UT=U1`,
    }
  );

  const data = await res.json();

  return data;
};
