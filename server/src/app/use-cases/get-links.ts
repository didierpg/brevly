import { makeRight } from "@/main/shared/either";
import { LinksRepository } from "../../domain/repositories/links-repository";

export class GetLinksUseCase {
  constructor(private linksRepository: LinksRepository) {}

  async execute() {
    const allLinks = await this.linksRepository.findAll();
    return makeRight(allLinks);
  }
}
