import { ExportLinksUseCase } from "@/app/use-cases/export-links";
import { db, pg } from "@/infra/db";
import { DrizzleLinksRepository } from "@/infra/db/repositories/drizzle-links-repository";
import { CloudflareR2StorageProvider } from "@/infra/storage/cloudflare-r2-storage-provider";

export function makeExportLinkUseCase() {
  const linksRepository = new DrizzleLinksRepository(db, pg);
  const storageProvider = new CloudflareR2StorageProvider();
  return new ExportLinksUseCase(linksRepository, storageProvider);
}
