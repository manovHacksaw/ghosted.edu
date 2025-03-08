/*
  Warnings:

  - You are about to alter the column `title` on the `experiences` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `company` on the `experiences` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `industry` on the `insights` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `demandLevel` on the `insights` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `interests` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `alternative_career_option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assessment_answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `career_strategy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `learning_path` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suitable_role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `experiences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `insights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `interests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserSkillGaps" DROP CONSTRAINT "_UserSkillGaps_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSkillGaps" DROP CONSTRAINT "_UserSkillGaps_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserSkills" DROP CONSTRAINT "_UserSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSkills" DROP CONSTRAINT "_UserSkills_B_fkey";

-- DropForeignKey
ALTER TABLE "alternative_career_option" DROP CONSTRAINT "alternative_career_option_userId_fkey";

-- DropForeignKey
ALTER TABLE "assessment_answer" DROP CONSTRAINT "assessment_answer_userId_fkey";

-- DropForeignKey
ALTER TABLE "career_strategy" DROP CONSTRAINT "career_strategy_userId_fkey";

-- DropForeignKey
ALTER TABLE "experiences" DROP CONSTRAINT "experiences_userId_fkey";

-- DropForeignKey
ALTER TABLE "insights" DROP CONSTRAINT "insights_userId_fkey";

-- DropForeignKey
ALTER TABLE "interests" DROP CONSTRAINT "interests_userId_fkey";

-- DropForeignKey
ALTER TABLE "learning_path" DROP CONSTRAINT "learning_path_suitableRoleId_fkey";

-- DropForeignKey
ALTER TABLE "resource" DROP CONSTRAINT "resource_learningPathId_fkey";

-- DropForeignKey
ALTER TABLE "suitable_role" DROP CONSTRAINT "suitable_role_insightId_fkey";

-- AlterTable
ALTER TABLE "experiences" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "company" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "insights" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "industry" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "demandLevel" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "interests" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "alternative_career_option";

-- DropTable
DROP TABLE "assessment_answer";

-- DropTable
DROP TABLE "career_strategy";

-- DropTable
DROP TABLE "learning_path";

-- DropTable
DROP TABLE "resource";

-- DropTable
DROP TABLE "skill";

-- DropTable
DROP TABLE "suitable_role";

-- CreateTable
CREATE TABLE "users" (
    "OCId" TEXT NOT NULL,
    "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "resumeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("OCId")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "proficiency" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_answers" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suitable_roles" (
    "id" SERIAL NOT NULL,
    "insightId" INTEGER NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "matchPercentage" DOUBLE PRECISION,
    "description" TEXT,
    "coreSkillsRequired" TEXT[],
    "softSkillsRequired" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suitable_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_paths" (
    "id" SERIAL NOT NULL,
    "suitableRoleId" INTEGER NOT NULL,
    "step" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" SERIAL NOT NULL,
    "learningPathId" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_strategies" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "phase" VARCHAR(50) NOT NULL,
    "actions" TEXT NOT NULL,
    "expectedOutcome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternative_career_options" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "field" VARCHAR(100) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alternative_career_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_OCId_key" ON "users"("OCId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- AddForeignKey
ALTER TABLE "interests" ADD CONSTRAINT "interests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_answers" ADD CONSTRAINT "assessment_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insights" ADD CONSTRAINT "insights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suitable_roles" ADD CONSTRAINT "suitable_roles_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "insights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_suitableRoleId_fkey" FOREIGN KEY ("suitableRoleId") REFERENCES "suitable_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_strategies" ADD CONSTRAINT "career_strategies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alternative_career_options" ADD CONSTRAINT "alternative_career_options_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSkills" ADD CONSTRAINT "_UserSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSkills" ADD CONSTRAINT "_UserSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSkillGaps" ADD CONSTRAINT "_UserSkillGaps_A_fkey" FOREIGN KEY ("A") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSkillGaps" ADD CONSTRAINT "_UserSkillGaps_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;
