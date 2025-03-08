/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("OCId");

-- CreateTable
CREATE TABLE "skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "proficiency" INTEGER,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_answer" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "assessment_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insights" (
    "userId" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "industry" TEXT,
    "growthRate" DOUBLE PRECISION,
    "demandLevel" TEXT,
    "topSkills" TEXT[],
    "recommendedSkills" TEXT[],

    CONSTRAINT "insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suitable_role" (
    "id" SERIAL NOT NULL,
    "insightId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "matchPercentage" DOUBLE PRECISION,
    "description" TEXT,
    "coreSkillsRequired" TEXT[],
    "softSkillsRequired" TEXT[],

    CONSTRAINT "suitable_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_path" (
    "id" SERIAL NOT NULL,
    "suitableRoleId" INTEGER NOT NULL,
    "step" TEXT NOT NULL,

    CONSTRAINT "learning_path_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource" (
    "id" SERIAL NOT NULL,
    "learningPathId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_strategy" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "actions" TEXT NOT NULL,
    "expectedOutcome" TEXT NOT NULL,

    CONSTRAINT "career_strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternative_career_option" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "alternative_career_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserSkills" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserSkills_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserSkillGaps" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserSkillGaps_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "insights_userId_key" ON "insights"("userId");

-- CreateIndex
CREATE INDEX "_UserSkills_B_index" ON "_UserSkills"("B");

-- CreateIndex
CREATE INDEX "_UserSkillGaps_B_index" ON "_UserSkillGaps"("B");

-- AddForeignKey
ALTER TABLE "interests" ADD CONSTRAINT "interests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_answer" ADD CONSTRAINT "assessment_answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insights" ADD CONSTRAINT "insights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suitable_role" ADD CONSTRAINT "suitable_role_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "insights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path" ADD CONSTRAINT "learning_path_suitableRoleId_fkey" FOREIGN KEY ("suitableRoleId") REFERENCES "suitable_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource" ADD CONSTRAINT "resource_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "learning_path"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_strategy" ADD CONSTRAINT "career_strategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alternative_career_option" ADD CONSTRAINT "alternative_career_option_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSkills" ADD CONSTRAINT "_UserSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSkills" ADD CONSTRAINT "_UserSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSkillGaps" ADD CONSTRAINT "_UserSkillGaps_A_fkey" FOREIGN KEY ("A") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSkillGaps" ADD CONSTRAINT "_UserSkillGaps_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("OCId") ON DELETE CASCADE ON UPDATE CASCADE;
