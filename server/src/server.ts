import { env } from "@/env";
import fastify from "fastify";
import "dotenv/config";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { createLinkRoute } from "./infra/http/routes/create-link";
import { resolveLinkRoute } from "./infra/http/routes/resolve-link";
import { listLinksRoute } from "./infra/http/routes/list-links";
import fastifyCors from "@fastify/cors";
import { runMigrations } from "./infra/db";

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Brev.ly API",
      description: "API do Encurtador de URLs da Pós-Graduação",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

app.register(createLinkRoute);
app.register(resolveLinkRoute);
app.register(listLinksRoute);

async function start() {
  try {
    await runMigrations();

    const address = await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    console.log(`🚀 Server listening at ${address}`);
    console.log(`📚 API docs available at ${address}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

export default app;
