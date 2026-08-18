/*
  Warnings:

  - You are about to drop the column `color` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('ADMIN', 'MEMBER', 'VIEWER');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "ProjectMember" ADD COLUMN     "role" "ProjectRole" NOT NULL DEFAULT 'MEMBER';

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
