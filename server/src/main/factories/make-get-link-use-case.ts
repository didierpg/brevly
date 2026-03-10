import { db } from "@/infra/db";
import { GetLinkUseCase } from "@/app/use-cases/get-link";

export function makeGetLinkUseCase() {
  return new GetLinkUseCase(db);
}
