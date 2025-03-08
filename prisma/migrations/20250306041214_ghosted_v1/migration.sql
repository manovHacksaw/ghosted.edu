/*
  Warnings:

  - A unique constraint covering the columns `[OCId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_OCId_key" ON "User"("OCId");
