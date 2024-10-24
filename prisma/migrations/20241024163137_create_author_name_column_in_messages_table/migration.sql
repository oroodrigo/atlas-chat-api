/*
  Warnings:

  - Added the required column `author_name` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "author_name" TEXT NOT NULL;
