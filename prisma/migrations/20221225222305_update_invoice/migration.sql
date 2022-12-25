/*
  Warnings:

  - A unique constraint covering the columns `[showId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_showId_fkey";

-- DropForeignKey
ALTER TABLE "VenueText" DROP CONSTRAINT "VenueText_textId_fkey";

-- AlterTable
ALTER TABLE "VenueText" ALTER COLUMN "textId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_showId_key" ON "Invoice"("showId");

-- AddForeignKey
ALTER TABLE "VenueText" ADD CONSTRAINT "VenueText_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
