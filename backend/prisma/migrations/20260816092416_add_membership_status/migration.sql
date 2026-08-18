-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "ProjectMember" ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING';
