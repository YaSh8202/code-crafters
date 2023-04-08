/*
  Warnings:

  - You are about to drop the column `submission_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LikedSubmissions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Challenge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `difficulty` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Challenge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `solution_id` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('Frontend', 'Backend', 'Fullstack', 'Mobile', 'DevOps', 'DataScience', 'ML', 'AI', 'Blockchain', 'CyberSecurity', 'GameDev', 'Other');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_challenge_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_LikedSubmissions" DROP CONSTRAINT "_LikedSubmissions_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikedSubmissions" DROP CONSTRAINT "_LikedSubmissions_B_fkey";

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "ChallengeType" NOT NULL,
ALTER COLUMN "videoURL" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "submission_id",
ADD COLUMN     "solution_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Submission";

-- DropTable
DROP TABLE "_LikedSubmissions";

-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "repoURL" TEXT NOT NULL,
    "liveURL" TEXT,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LikedSolutions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LikedSolutions_AB_unique" ON "_LikedSolutions"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedSolutions_B_index" ON "_LikedSolutions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_slug_key" ON "Challenge"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "Solution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedSolutions" ADD CONSTRAINT "_LikedSolutions_A_fkey" FOREIGN KEY ("A") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedSolutions" ADD CONSTRAINT "_LikedSolutions_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
