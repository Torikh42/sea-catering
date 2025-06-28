/*
  Warnings:

  - You are about to drop the column `userId` on the `Testimonial` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_userId_fkey";

-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "userId";
