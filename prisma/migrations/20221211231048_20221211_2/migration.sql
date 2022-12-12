-- DropForeignKey
ALTER TABLE "VenueText" DROP CONSTRAINT "VenueText_showId_fkey";

-- DropForeignKey
ALTER TABLE "VenueText" DROP CONSTRAINT "VenueText_textId_fkey";

-- DropForeignKey
ALTER TABLE "VenueText" DROP CONSTRAINT "VenueText_userId_fkey";

-- DropForeignKey
ALTER TABLE "VenueText" DROP CONSTRAINT "VenueText_venueId_fkey";

-- AddForeignKey
ALTER TABLE "VenueText" ADD CONSTRAINT "VenueText_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueText" ADD CONSTRAINT "VenueText_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueText" ADD CONSTRAINT "VenueText_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueText" ADD CONSTRAINT "VenueText_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
