import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { LinkSchema } from "@/domain/entities/link";
import { createLinkUseCase } from "@/application/use-cases/create-link";
import { PostgresLinkRepository } from "@/infra/db/repositories/postgres-link-repository";
import { isLeft } from "@/core/either";
import { LinkErrorSchema } from "../../../domain/errors/link-errors";

export async function createLinkRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/links",
    {
      schema: {
        summary: "Create a shortened link",
        tags: ["links"],
        body: LinkSchema.pick({ originalUrl: true, shortCode: true }),
        response: {
          201: LinkSchema,
          409: LinkErrorSchema.describe("Conflict - Short code already in use"),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortCode } = request.body;

      const repository = new PostgresLinkRepository();
      const execute = createLinkUseCase(repository);

      const result = await execute({ originalUrl, shortCode });

      if (isLeft(result)) {
        return reply.status(409).send(result.left);
      }

      return reply.status(201).send(result.right);
    },
  );
}
