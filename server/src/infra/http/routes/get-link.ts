import { FastifyInstance } from "fastify";
import { z } from "zod";
import { makeGetLinkUseCase } from "@/main/factories/make-get-link-use-case";
import { isLeft } from "@/main/shared/either";

export async function getLinkRoute(app: FastifyInstance) {
  app.get(
    "/:code",
    {
      schema: {
        params: z.object({
          code: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { code } = request.params as { code: string };
      const getLinkUseCase = makeGetLinkUseCase();

      const result = await getLinkUseCase.execute({ shortCode: code });

      if (isLeft(result)) {
        return reply.status(404).send({ message: result.left.message });
      }

      // O status 302 é para redirecionamento temporário (bom para analytics)
      return reply.redirect(result.right.originalUrl, 302);
    },
  );
}
