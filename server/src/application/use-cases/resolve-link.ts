import { Either, makeLeft, makeRight } from "@/core/either";
import { LinkErrors } from "@/domain/errors/link-errors";
import { LinkRepository } from "@/domain/repositories/link-repository";

export const resolveLinkUseCase = (linkRepository: LinkRepository) => {
  return async (
    shortCode: string,
  ): Promise<
    Either<ReturnType<typeof LinkErrors.LinkNotFoundByShortCode>, string>
  > => {
    const originalUrl =
      await linkRepository.findByShortCodeAndIncrementAccessCount(shortCode);
    if (!originalUrl) {
      return makeLeft(LinkErrors.LinkNotFoundByShortCode(shortCode));
    }
    return makeRight(originalUrl);
  };
};
