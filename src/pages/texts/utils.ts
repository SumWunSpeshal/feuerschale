import { Text } from "@prisma/client";

export type TextData =
  | (Text & {
      VenueText: {
        id: string;
      }[];
    })[]
  | undefined;

export function groupTexts(textData: TextData) {
  return textData?.reduce((acc, curr) => {
    const category = curr.VenueText.length ? "In Verwendung" : "Unbenutzt";
    return {
      ...acc,
      [category]: [...(acc[category] || []), curr],
    };
  }, {} as Record<string, TextData>);
}
