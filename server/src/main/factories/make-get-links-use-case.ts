import { db } from "@/infra/db";
import { GetLinksUseCase } from "@/app/use-cases/get-links";
import { DrizzleLinksRepository } from "@/infra/db/repositories/drizzle-links-repository";

export function makeGetLinksUseCase() {
  const linksRepository = new DrizzleLinksRepository(db);
  return new GetLinksUseCase(linksRepository);
}
