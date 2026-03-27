import { listLinksUseCase } from "@/application/use-cases/list-links";
import { LinkSchema } from "@/domain/entities/link";
import { PostgresLinkRepository } from "@/infra/db/repositories/postgres-link-repository";
import { FastifyInstance, FastifyTypeProvider } from "fastify";
import z from "zod";

export const listLinksRoute = (app: FastifyInstance) => {
  app.withTypeProvider<FastifyTypeProvider>().get(
    "/links",
    {
      schema: {
        summary: "List shortened links",
        tags: ["links"],
        response: {
          200: z.array(LinkSchema),
        },
      },
    },
    async (_, reply) => {
      const linkRepository = new PostgresLinkRepository();
      const execute = listLinksUseCase(linkRepository);
      const result = await execute();
      reply.status(200).send(result.right);
    },
  );
};
