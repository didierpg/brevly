import { env } from "@/env";
import fastify from "fastify";
import "dotenv/config";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

async function start() {
  try {
    const address = await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    console.log(`🚀 Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

export default app;
