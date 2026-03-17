import { isLeft } from "@/main/shared/either";
import { makeDeleteLinkUseCase } from "@/main/factories/make-delete-link-use-case";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export async function deleteLinkRoute(app: FastifyInstance) {
  app.delete(
    "/links/:id",
    {
      schema: {
        summary: "Cria um novo link encurtado",
        params: z.object({
          id: z.uuid("ID inválido"),
        }),
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const deleteLinkUseCase = makeDeleteLinkUseCase();
      const result = await deleteLinkUseCase.execute(id);

      if (isLeft(result)) {
        return reply.status(404).send({ message: "Link not found" });
      }

      return reply.status(204).send();
    },
  );
}
