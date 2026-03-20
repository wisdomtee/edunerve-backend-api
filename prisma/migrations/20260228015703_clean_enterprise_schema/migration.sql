/*
  Warnings:

  - Made the column `schoolId` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schoolId` on table `Parent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schoolId` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_schoolId_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Parent" ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "schoolId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "AuditLog_schoolId_idx" ON "AuditLog"("schoolId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Course_schoolId_idx" ON "Course"("schoolId");

-- CreateIndex
CREATE INDEX "Parent_schoolId_idx" ON "Parent"("schoolId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_schoolId_idx" ON "PaymentTransaction"("schoolId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_reference_idx" ON "PaymentTransaction"("reference");

-- CreateIndex
CREATE INDEX "Result_courseId_idx" ON "Result"("courseId");

-- CreateIndex
CREATE INDEX "Result_createdAt_idx" ON "Result"("createdAt");

-- CreateIndex
CREATE INDEX "SchoolSubscription_schoolId_idx" ON "SchoolSubscription"("schoolId");

-- CreateIndex
CREATE INDEX "SchoolSubscription_status_idx" ON "SchoolSubscription"("status");

-- CreateIndex
CREATE INDEX "Student_schoolId_idx" ON "Student"("schoolId");

-- CreateIndex
CREATE INDEX "User_schoolId_idx" ON "User"("schoolId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
