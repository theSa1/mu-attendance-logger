-- CreateTable
CREATE TABLE "Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "facultyContact" TEXT NOT NULL,
    "facultyLocation" TEXT NOT NULL,
    "facultyProfilePic" TEXT NOT NULL,
    "facultyName" TEXT NOT NULL,
    "subId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    CONSTRAINT "Subject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
