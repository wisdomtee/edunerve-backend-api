/*
  Warnings:

  - The values [PAYSTACK] on the enum `PaymentGateway` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `PaymentTransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `updatedAt` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Parent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Result` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchoolSubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionPlan` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `schoolId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentGateway_new" AS ENUM ('FLUTTERWAVE', 'STRIPE');
ALTER TABLE "PaymentTransaction" ALTER COLUMN "gateway" TYPE "PaymentGateway_new" USING ("gateway"::text::"PaymentGateway_new");
ALTER TYPE "PaymentGateway" RENAME TO "PaymentGateway_old";
ALTER TYPE "PaymentGateway_new" RENAME TO "PaymentGateway";
DROP TYPE "PaymentGateway_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_studentId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolSubscription" DROP CONSTRAINT "SchoolSubscription_planId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolSubscription" DROP CONSTRAINT "SchoolSubscription_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_parentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_schoolId_fkey";

-- DropIndex
DROP INDEX "Course_schoolId_idx";

-- DropIndex
DROP INDEX "PaymentTransaction_reference_idx";

-- DropIndex
DROP INDEX "PaymentTransaction_schoolId_idx";

-- DropIndex
DROP INDEX "Student_schoolId_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_schoolId_idx";

-- AlterTable
ALTER TABLE "PaymentTransaction" ADD COLUMN     "metadata" JSONB,
ALTER COLUMN "currency" DROP DEFAULT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "School" DROP COLUMN "updatedAt",
ADD COLUMN     "studentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "studentQuota" INTEGER,
ADD COLUMN     "subscriptionActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "parentId",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "schoolId" SET NOT NULL;

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Parent";

-- DropTable
DROP TABLE "Result";

-- DropTable
DROP TABLE "SchoolSubscription";

-- DropTable
DROP TABLE "SubscriptionPlan";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
