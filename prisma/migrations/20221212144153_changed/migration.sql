/*
  Warnings:

  - You are about to alter the column `enrollmentNumber` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "enrollmentNumber" BIGINT NOT NULL,
    "grNumber" INTEGER NOT NULL,
    "muPassword" TEXT NOT NULL,
    "jws" TEXT NOT NULL
);
INSERT INTO "new_User" ("enrollmentNumber", "grNumber", "id", "jws", "muPassword", "name") SELECT "enrollmentNumber", "grNumber", "id", "jws", "muPassword", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_enrollmentNumber_key" ON "User"("enrollmentNumber");
CREATE UNIQUE INDEX "User_grNumber_key" ON "User"("grNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
