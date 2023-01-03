-- DropForeignKey
ALTER TABLE "Venue" DROP CONSTRAINT "Venue_userId_fkey";

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
