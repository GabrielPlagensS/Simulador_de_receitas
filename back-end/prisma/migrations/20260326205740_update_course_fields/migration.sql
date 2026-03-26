/*
  Warnings:

  - Added the required column `createdAt` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hours` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessons` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profissao` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "createdAt" TEXT NOT NULL,
ADD COLUMN     "hours" INTEGER NOT NULL,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "lessons" INTEGER NOT NULL,
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "profissao" TEXT NOT NULL;
