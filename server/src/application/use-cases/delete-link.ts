import { Either, makeLeft, makeRight } from "@/core/either";
import { LinkErrors } from "@/domain/errors/link-errors";
import { LinkRepository } from "@/domain/repositories/link-repository";

export const deleteLinkUseCase = (linkRepository: LinkRepository) => {
  return async (
    shortCode: string,
  ): Promise<
    Either<ReturnType<typeof LinkErrors.LinkNotFoundByShortCode>, null>
  > => {
    if (await linkRepository.delete(shortCode)) {
      return makeRight(null);
    }
    return makeLeft(LinkErrors.LinkNotFoundByShortCode(shortCode));
  };
};
