import { env } from "@/env";
import { schema } from "@/infra/db/schemas";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const pg = postgres(env.DATABASE_URL);
export const db = drizzle(pg, {
  schema,
  logger: process.env.NODE_ENV !== "production",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log("⏳ Verificando migrações do banco...");

  const migrationPath = path.resolve(__dirname, "migrations");
  try {
    await migrate(db, { migrationsFolder: migrationPath });
    console.log("✅ Banco de dados sincronizado!");
  } catch (error) {
    console.error("❌ Erro ao rodar migrações:", error);
    process.exit(1);
  }
}
