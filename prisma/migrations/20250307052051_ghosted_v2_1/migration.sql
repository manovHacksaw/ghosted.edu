/*
  Warnings:

  - Added the required column `description` to the `RecommendedRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchPercentage` to the `RecommendedRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outlook` to the `RecommendedRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecommendedRole" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "matchPercentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "outlook" TEXT NOT NULL;
