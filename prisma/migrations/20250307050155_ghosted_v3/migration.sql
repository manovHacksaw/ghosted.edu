/*
  Warnings:

  - You are about to drop the `_UserSkillGaps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserSkills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `alternative_career_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assessment_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `career_strategies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `experiences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `insights` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `interests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `learning_paths` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suitable_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

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
ALTER TABLE "alternative_career_options" DROP CONSTRAINT "alternative_career_options_userId_fkey";

-- DropForeignKey
ALTER TABLE "assessment_answers" DROP CONSTRAINT "assessment_answers_userId_fkey";

-- DropForeignKey
ALTER TABLE "career_strategies" DROP CONSTRAINT "career_strategies_userId_fkey";

-- DropForeignKey
ALTER TABLE "experiences" DROP CONSTRAINT "experiences_userId_fkey";

-- DropForeignKey
ALTER TABLE "insights" DROP CONSTRAINT "insights_userId_fkey";

-- DropForeignKey
ALTER TABLE "interests" DROP CONSTRAINT "interests_userId_fkey";

-- DropForeignKey
ALTER TABLE "learning_paths" DROP CONSTRAINT "learning_paths_suitableRoleId_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_learningPathId_fkey";

-- DropForeignKey
ALTER TABLE "suitable_roles" DROP CONSTRAINT "suitable_roles_insightId_fkey";

-- DropTable
DROP TABLE "_UserSkillGaps";

-- DropTable
DROP TABLE "_UserSkills";

-- DropTable
DROP TABLE "alternative_career_options";

-- DropTable
DROP TABLE "assessment_answers";

-- DropTable
DROP TABLE "career_strategies";

-- DropTable
DROP TABLE "experiences";

-- DropTable
DROP TABLE "insights";

-- DropTable
DROP TABLE "interests";

-- DropTable
DROP TABLE "learning_paths";

-- DropTable
DROP TABLE "resources";

-- DropTable
DROP TABLE "skills";

-- DropTable
DROP TABLE "suitable_roles";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "OCId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "bio" TEXT,
    "isOnboarded" BOOLEAN NOT NULL,
    "interests" JSONB,
    "recommendedIndustry" TEXT,
    "alternativeOptions" JSONB,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("OCId")
);

-- CreateTable
CREATE TABLE "SkillGap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overcoming" TEXT NOT NULL,

    CONSTRAINT "SkillGap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyStep" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "outcomes" TEXT NOT NULL,

    CONSTRAINT "StrategyStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "atsScore" DOUBLE PRECISION,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "startYear" TEXT NOT NULL,
    "endYear" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proficiency" INTEGER NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "currentlyWorking" BOOLEAN NOT NULL,
    "description" TEXT,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfAssessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "SelfAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendedRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RecommendedRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryRange" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "median" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SalaryRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillRequired" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT,

    CONSTRAINT "SkillRequired_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RecommendedRoleToResource" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecommendedRoleToResource_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ResourceToSkillGap" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ResourceToSkillGap_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ResourceToSkillRequired" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ResourceToSkillRequired_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_OCId_key" ON "User"("OCId");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_userId_key" ON "Resume"("userId");

-- CreateIndex
CREATE INDEX "_RecommendedRoleToResource_B_index" ON "_RecommendedRoleToResource"("B");

-- CreateIndex
CREATE INDEX "_ResourceToSkillGap_B_index" ON "_ResourceToSkillGap"("B");

-- CreateIndex
CREATE INDEX "_ResourceToSkillRequired_B_index" ON "_ResourceToSkillRequired"("B");

-- AddForeignKey
ALTER TABLE "SkillGap" ADD CONSTRAINT "SkillGap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyStep" ADD CONSTRAINT "StrategyStep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfAssessment" ADD CONSTRAINT "SelfAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedRole" ADD CONSTRAINT "RecommendedRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryRange" ADD CONSTRAINT "SalaryRange_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RecommendedRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRequired" ADD CONSTRAINT "SkillRequired_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("OCId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRequired" ADD CONSTRAINT "SkillRequired_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RecommendedRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecommendedRoleToResource" ADD CONSTRAINT "_RecommendedRoleToResource_A_fkey" FOREIGN KEY ("A") REFERENCES "RecommendedRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecommendedRoleToResource" ADD CONSTRAINT "_RecommendedRoleToResource_B_fkey" FOREIGN KEY ("B") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToSkillGap" ADD CONSTRAINT "_ResourceToSkillGap_A_fkey" FOREIGN KEY ("A") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToSkillGap" ADD CONSTRAINT "_ResourceToSkillGap_B_fkey" FOREIGN KEY ("B") REFERENCES "SkillGap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToSkillRequired" ADD CONSTRAINT "_ResourceToSkillRequired_A_fkey" FOREIGN KEY ("A") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToSkillRequired" ADD CONSTRAINT "_ResourceToSkillRequired_B_fkey" FOREIGN KEY ("B") REFERENCES "SkillRequired"("id") ON DELETE CASCADE ON UPDATE CASCADE;
