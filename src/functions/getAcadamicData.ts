import { PrismaClient } from "@prisma/client";

export const getAcadamicData = async (userId: number, prisma: PrismaClient) => {
  const { grNumber, jws } = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  const res = await fetch(
    `https://emp.marwadiuniversity.ac.in:553/MUWebAPI/api/Dashboard/Phase2`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserId: grNumber.toString(),
        ObjSec: jws,
        UT: "U1",
      }),
    }
  );

  const data: {
    Subjects: {
      SubjectID: number;
      SubjectShortName: string;
      SubjectName: string;
      GTUSubjectCode: string;
      Empcode: string;
      EmpName: string;
      EmpContactNo: string;
      CompletePer: number;
      Location: string;
      EcontentCount: number;
    }[];
  } = await res.json();

  for await (const subject of data.Subjects) {
    const subjectOnServer = await prisma.subject.findFirst({
      where: {
        subId: subject.SubjectID,
        userId: userId,
        code: subject.SubjectShortName,
      },
    });

    if (!subjectOnServer) {
      await prisma.subject.create({
        data: {
          subId: subject.SubjectID,
          userId: userId,
          code: subject.SubjectShortName,
          name: subject.SubjectName,
          facultyName: subject.EmpName,
          facultyContact: subject.EmpContactNo,
          facultyLocation: subject.Location,
          facultyProfilePic: `https://marwadieducation.edu.in/MEFOnline/handler/getImage.ashx?Id=${subject.Empcode}`,
        },
      });
    }
  }
};
