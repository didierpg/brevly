import { env } from "@/env";
import { schema } from "@/infra/db/schemas";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";

const isDev = process.env.NODE_ENV !== "production";

export const pg = postgres(env.DATABASE_URL, {
  debug: isDev ? (connection, query, params) => console.log(query) : false,
});

export const db = drizzle(pg, {
  schema,
  logger: isDev,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log("⏳ Checking database migrations...");

  const migrationPath = path.resolve(__dirname, "migrations");
  try {
    await migrate(db, { migrationsFolder: migrationPath });
    console.log("✅ Database synced successfully!");
  } catch (error) {
    console.error("❌ Error running migrations:", error);
    process.exit(1);
  }
}
