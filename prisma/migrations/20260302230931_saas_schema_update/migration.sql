/*
  Warnings:

  - The values [INSTRUCTOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `studentCount` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `studentQuota` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionActive` on the `School` table. All the data in the column will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentTransaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'TEACHER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_schoolId_fkey";

-- AlterTable
ALTER TABLE "School" DROP COLUMN "studentCount",
DROP COLUMN "studentQuota",
DROP COLUMN "subscriptionActive",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "subscriptionPlan" TEXT NOT NULL DEFAULT 'FREE',
ADD COLUMN     "subscriptionStatus" TEXT NOT NULL DEFAULT 'INACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'TEACHER';

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "PaymentTransaction";

-- DropEnum
DROP TYPE "PaymentGateway";

-- CreateIndex
CREATE UNIQUE INDEX "School_email_key" ON "School"("email");
