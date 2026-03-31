import { exportLinksUseCase } from "@/application/use-cases/export-links";
import { PostgresLinkRepository } from "@/infra/db/repositories/postgres-link-repository";
import { CloudflareR2StorageProvider } from "@/infra/storage/cloudflare-r2-storage-provider";
import { FastifyInstance } from "fastify";
import z from "zod";

export async function exportLinksRoute(app: FastifyInstance) {
  app.post(
    "/links/export",
    {
      schema: {
        summary: "",
        tags: ["links"],
        response: {
          200: z.object({ publicUrl: z.url() }),
        },
      },
    },
    async (_, reply) => {
      const execute = exportLinksUseCase(
        new PostgresLinkRepository(),
        new CloudflareR2StorageProvider(),
      );
      const result = await execute();

      return reply.status(200).send(result.right);
    },
  );
}
