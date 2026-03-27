import { Either, makeRight } from "@/core/either";
import { Link } from "@/domain/entities/link";
import { LinkRepository } from "@/domain/repositories/link-repository";

export const listLinksUseCase = (linksRepository: LinkRepository) => {
  return async (): Promise<Either<never, Link[]>> => {
    const links = await linksRepository.findAll();
    return makeRight(links);
  };
};
