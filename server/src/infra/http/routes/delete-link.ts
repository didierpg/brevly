import { deleteLinkUseCase } from "@/application/use-cases/delete-link";
import { isLeft } from "@/core/either";
import { LinkSchema } from "@/domain/entities/link";
import { LinkErrorSchema } from "@/domain/errors/link-errors";
import { PostgresLinkRepository } from "@/infra/db/repositories/postgres-link-repository";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const deleteLinkRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/links/:shortCode",
    {
      schema: {
        summary: "Delete a link by short code",
        tags: ["links"],
        params: z.object({
          shortCode: LinkSchema.shape.shortCode,
        }),
        response: {
          204: z.null(),
          404: LinkErrorSchema.describe(
            "Not Found - No link found for short code",
          ),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params;

      const repository = new PostgresLinkRepository();
      const execute = deleteLinkUseCase(repository);
      const result = await execute(shortCode);
      if (isLeft(result)) {
        return reply
          .status(404)
          .send({ message: `Link not found for short code ${shortCode}` });
      }

      return reply.status(204).send();
    },
  );
};
