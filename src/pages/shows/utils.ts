import { Show, Text, Venue } from "@prisma/client";
import { formatDate } from "src/utils/format-date";

export type ShowData =
  | (Show & {
      VenueText: {
        Text: Text;
        Venue: Venue;
      }[];
    })[]
  | undefined;

export function groupShows(venueData: ShowData) {
  return venueData?.reduce((acc, curr) => {
    const yyyyMMdd = formatDate["yyyy-MM-dd"](curr.date) as string;
    return {
      ...acc,
      [yyyyMMdd]: [...(acc[yyyyMMdd] || []), curr],
    };
  }, {} as Record<string, ShowData>);
}
