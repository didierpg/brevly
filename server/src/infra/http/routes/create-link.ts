import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { isLeft } from "@/infra/shared/either";
import { makeCreateLinkUseCase } from "@/main/factories/make-create-link-use-case";

export async function createLinkRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/links",
    {
      schema: {
        summary: "Cria um novo link encurtado",
        body: z.object({
          url: z.httpUrl("URL original inválida"),
          shortCode: z
            .string()
            .regex(
              /^[a-zA-Z0-9_-]+$/,
              "O código curto deve ser alfanumérico, podendo conter '-' ou '_'",
            )
            .min(4, "O código curto deve ter pelo menos 4 caracteres")
            .max(20, "O código curto deve ter no máximo 20 caracteres"),
        }),
      },
    },
    async (request, reply) => {
      const { url, shortCode } = request.body;

      const createLinkUseCase = makeCreateLinkUseCase();
      const result = await createLinkUseCase.execute({
        originalUrl: url,
        shortCode,
      });

      if (isLeft(result)) {
        return reply.status(400).send({ message: result.left.message });
      }

      return reply.status(201).send(result.right);
    },
  );
}
