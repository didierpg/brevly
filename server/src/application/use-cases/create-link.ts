import { z } from "zod";
import { Link, LinkSchema } from "@/domain/entities/link";
import { LinkRepository } from "@/domain/repositories/link-repository";
import { Either, makeLeft, makeRight } from "@/core/either";
import { LinkErrors } from "@/domain/errors/link-errors";

const CreateLinkSchema = LinkSchema.pick({
  originalUrl: true,
  shortCode: true,
});

export type CreateLinkInput = z.infer<typeof CreateLinkSchema>;

export const createLinkUseCase = (repository: LinkRepository) => {
  return async (
    data: CreateLinkInput,
  ): Promise<
    Either<ReturnType<typeof LinkErrors.ShortCodeAlreadyInUseError>, Link>
  > => {
    const { originalUrl, shortCode } = data;

    const alreadyExists = await repository.findByShortCode(shortCode);

    if (alreadyExists) {
      return makeLeft(LinkErrors.ShortCodeAlreadyInUseError(shortCode));
    }

    const link = LinkSchema.parse({
      id: crypto.randomUUID(),
      originalUrl,
      shortCode,
      createdAt: new Date(),
    });

    await repository.create(link);

    return makeRight(link);
  };
};
