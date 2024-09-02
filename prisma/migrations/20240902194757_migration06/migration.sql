/*
  Warnings:

  - You are about to drop the column `ythandle` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `ytHandle` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_ythandle_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "ythandle",
ADD COLUMN     "ytHandle" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_ytHandle_fkey" FOREIGN KEY ("ytHandle") REFERENCES "User"("ytHandle") ON DELETE RESTRICT ON UPDATE CASCADE;
