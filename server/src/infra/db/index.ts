import { env } from "@/env";
import { schema } from "@/infra/db/schemas";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

export const pg = postgres(env.DATABASE_URL);
export const db = drizzle(pg, { schema });
