import { City, Invoice, Show, Text, Venue } from "@prisma/client";
import { formatDate } from "src/utils/format-date";

export type ShowData =
  | (Show & {
      VenueText: {
        Text: Text | null;
        Venue: Venue & {
          City: City;
        };
      }[];
      Invoice: Invoice[];
    })[]
  | undefined;

export function groupShows(venueData: ShowData) {
  return venueData?.reduce((acc, curr) => {
    const Month_yyyy = formatDate["Month_yyyy"](curr.date) as string;
    return {
      ...acc,
      [Month_yyyy]: [...(acc[Month_yyyy] || []), curr],
    };
  }, {} as Record<string, ShowData>);
}
