/*
  Warnings:

  - A unique constraint covering the columns `[fileName,userId]` on the table `Upload` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Upload_fileName_userId_key" ON "Upload"("fileName", "userId");
