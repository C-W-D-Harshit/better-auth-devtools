import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { getMigrations } from "better-auth/db/migration";
import { authOptions, dbFile } from "../lib/auth-options.mjs";

async function main() {
  await mkdir(dirname(dbFile), { recursive: true });

  const migrations = await getMigrations(authOptions);

  if (
    migrations.toBeCreated.length === 0 &&
    migrations.toBeAdded.length === 0
  ) {
    console.log(`Database is up to date: ${dbFile}`);
    return;
  }

  console.log(`Initializing database: ${dbFile}`);
  await migrations.runMigrations();
  console.log("Applied Better Auth and devtools migrations.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
