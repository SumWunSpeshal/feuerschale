import { City, Text, Venue, VenueText } from "@prisma/client";

export type VenueData =
  | (Venue & {
      City: City;
      VenueText: (VenueText & {
        Text: Text | null;
      })[];
    })[]
  | undefined;

export function groupVenues(venueData: VenueData) {
  return venueData?.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.City.Stadt]: [...(acc[curr.City.Stadt] || []), curr],
    };
  }, {} as Record<string, VenueData>);
}
