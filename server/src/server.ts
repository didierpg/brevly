import fastify from "fastify";
import "dotenv/config";
import { env } from "@/env";

const app = fastify();

app.get("/health", async (request, reply) => {
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
