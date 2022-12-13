/*
  Warnings:

  - Added the required column `facultyCode` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "facultyContact" TEXT NOT NULL,
    "facultyLocation" TEXT NOT NULL,
    "facultyProfilePic" TEXT NOT NULL,
    "facultyName" TEXT NOT NULL,
    "facultyCode" TEXT NOT NULL,
    "subId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    CONSTRAINT "Subject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subject" ("code", "facultyContact", "facultyLocation", "facultyName", "facultyProfilePic", "id", "name", "subId", "subjectId") SELECT "code", "facultyContact", "facultyLocation", "facultyName", "facultyProfilePic", "id", "name", "subId", "subjectId" FROM "Subject";
DROP TABLE "Subject";
ALTER TABLE "new_Subject" RENAME TO "Subject";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
