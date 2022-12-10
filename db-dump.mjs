import { exec } from "child_process";
import { config } from "dotenv";

config();

exec(
  `pg_dump '${process.env.DATABASE_URL}' > prisma/db-dump/${Date.now()}.sql`,
  (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    }
  }
);
