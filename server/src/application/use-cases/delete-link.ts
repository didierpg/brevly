import { Either, makeLeft, makeRight } from "@/core/either";
import { LinkErrors } from "@/domain/errors/link-errors";
import { LinkRepository } from "@/domain/repositories/link-repository";

export const deleteLinkUseCase = (linkRepository: LinkRepository) => {
  return async (
    id: string,
  ): Promise<Either<ReturnType<typeof LinkErrors.LinkNotFoundById>, null>> => {
    if (await linkRepository.delete(id)) {
      return makeRight(null);
    }
    return makeLeft(LinkErrors.LinkNotFoundById(id));
  };
};
