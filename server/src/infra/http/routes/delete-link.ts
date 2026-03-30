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
    "/links/:id",
    {
      schema: {
        summary: "Delete a link by idetifier",
        tags: ["links"],
        params: z.object({
          id: LinkSchema.shape.id,
        }),
        response: {
          204: z.null(),
          404: LinkErrorSchema.describe("Not Found - No link found for id"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const repository = new PostgresLinkRepository();
      const execute = deleteLinkUseCase(repository);
      const result = await execute(id);
      if (isLeft(result)) {
        return reply
          .status(404)
          .send({ message: `Link not found for id ${id}` });
      }

      return reply.status(204).send();
    },
  );
};
