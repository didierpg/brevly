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
import { getLinkRoute } from "./infra/http/routes/get-link";
import { getLinksRoute } from "./infra/http/routes/get-links";
import { deleteLinkRoute } from "./infra/http/routes/delete-link";
import { exportLinksRoute } from "./infra/http/routes/export-links";
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
});

app.register(createLinkRoute);
app.register(getLinkRoute);
app.register(getLinksRoute);
app.register(deleteLinkRoute);
app.register(exportLinksRoute);

async function start() {
  try {
    await runMigrations();

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
