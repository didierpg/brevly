import { DeleteLinkUseCase } from "@/app/use-cases/delete-link";
import { db } from "@/infra/db";
import { DrizzleLinksRepository } from "@/infra/db/repositories/drizzle-links-repository";

export function makeDeleteLinkUseCase() {
  const linksRepository = new DrizzleLinksRepository(db);
  return new DeleteLinkUseCase(linksRepository);
}
