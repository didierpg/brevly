import { db } from "@/infra/db";
import { CreateLinkUseCase } from "@/app/use-cases/create-link";

export function makeCreateLinkUseCase() {
  return new CreateLinkUseCase(db);
}
