import { env } from "@/env";
import { db } from "@/infra/db";
import fastify from "fastify";
import "dotenv/config";
import { sql } from "drizzle-orm";
const app = fastify();

app.get("/health", async (request, reply) => {
  await db.execute(sql`SELECT 1`);
  return { status: "ok" };
});

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export default app;
