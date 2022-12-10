import { City, PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

async function main() {
  const records: City[] = parse(readFileSync("./attic/steadte.csv", "utf8"), {
    delimiter: ";",
    columns: true,
  });

  const cities = await prisma.city.createMany({
    data: records.map(
      ({ Schluesselnummer, Stadt, PLZ, Bundesland, Landkreis }) => {
        return {
          Schluesselnummer,
          Stadt,
          PLZ,
          Bundesland,
          Landkreis,
        };
      }
    ),
  });

  console.log(cities);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
