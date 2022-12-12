/*
  Warnings:

  - Added the required column `jws` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "enrollmentNumber" INTEGER NOT NULL,
    "grNumber" INTEGER NOT NULL,
    "muPassword" TEXT NOT NULL,
    "jws" TEXT NOT NULL
);
INSERT INTO "new_User" ("enrollmentNumber", "grNumber", "id", "muPassword", "name") SELECT "enrollmentNumber", "grNumber", "id", "muPassword", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_enrollmentNumber_key" ON "User"("enrollmentNumber");
CREATE UNIQUE INDEX "User_grNumber_key" ON "User"("grNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
