import { makeExportLinkUseCase } from "@/main/factories/make-export-link-use-case";
import { FastifyInstance } from "fastify";

export async function exportLinksRoute(app: FastifyInstance) {
  app.post("/links/export", async (request, reply) => {
    const exportLinksUseCase = makeExportLinkUseCase();
    const result = await exportLinksUseCase.execute();

    if (result.left) {
      return reply.status(500).send({ message: "Failed to export links" });
    }
    return reply.status(200).send({ url: result.right });
  });
}
