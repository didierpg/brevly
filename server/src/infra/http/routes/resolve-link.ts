import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { LinkErrorSchema } from "@/domain/errors/link-errors";
import { LinkSchema } from "@/domain/entities/link";
import { resolveLinkUseCase } from "@/application/use-cases/resolve-link";
import { PostgresLinkRepository } from "@/infra/db/repositories/postgres-link-repository";
import { isLeft } from "@/core/either";

export const resolveLinkRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:shortCode",
    {
      schema: {
        summary: "",
        tags: ["links"],
        params: z.object({
          shortCode: LinkSchema.shape.shortCode,
        }),
        response: {
          302: z.null(),
          404: LinkErrorSchema.describe(
            "Not Found - No link found for short code",
          ),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params;

      const execute = resolveLinkUseCase(new PostgresLinkRepository());
      const result = await execute(shortCode);
      if (isLeft(result)) {
        return reply.status(404).send(result.left);
      }

      return reply.status(302).redirect(result.right);
    },
  );
};
