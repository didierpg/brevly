import { Either, makeLeft, makeRight } from "@/main/shared/either";
import { LinksRepository } from "../../domain/repositories/links-repository";

export class DeleteLinkUseCase {
  constructor(private linksRepository: LinksRepository) {}

  async execute(id: string): Promise<Either<Error, void>> {
    try {
      const existingLink = await this.linksRepository.findById(id);

      if (!existingLink) {
        return makeLeft(new Error("Link not found"));
      }

      await this.linksRepository.delete(id);

      return makeRight(undefined);
    } catch (error) {
      return makeLeft(new Error("Unexpected repository error"));
    }
  }
}
