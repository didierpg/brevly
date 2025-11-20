import fastify from "fastify";
import "dotenv/config";
import { env } from "./env.js";

const app = fastify();

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export default app;
