import { FastifyInstance } from "fastify";
import { makeGetLinksUseCase } from "@/main/factories/make-get-links-use-case";
import { isLeft } from "@/main/shared/either";

export async function getLinksRoute(app: FastifyInstance) {
  app.get("/links", async (request, reply) => {
    const getManyLinksUseCase = makeGetLinksUseCase();
    const result = await getManyLinksUseCase.execute();

    if (isLeft(result)) {
      return reply.status(500).send({ message: "Erro ao listar links" });
    }

    return result.right;
  });
}
