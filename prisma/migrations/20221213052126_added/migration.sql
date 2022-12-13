/*
  Warnings:

  - You are about to drop the column `subject` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `subjectId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "firstDiscoverd" DATETIME NOT NULL,
    "subjectId" INTEGER NOT NULL,
    CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attendance" ("date", "faculty", "firstDiscoverd", "id", "status", "time", "type", "userId") SELECT "date", "faculty", "firstDiscoverd", "id", "status", "time", "type", "userId" FROM "Attendance";
DROP TABLE "Attendance";
ALTER TABLE "new_Attendance" RENAME TO "Attendance";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
