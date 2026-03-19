import { LinksRepository } from "@/domain/repositories/links-repository";
import { StorageProvider } from "@/domain/storage/storage-provider";
import { makeRight } from "@/main/shared/either";
import { stringify } from "csv-stringify";
import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

export class ExportLinksUseCase {
  constructor(
    private linksRepository: LinksRepository,
    private storageProvider: StorageProvider,
  ) {}
  async execute() {
    const csv = stringify({
      delimiter: ",",
      header: true,
      columns: [
        { key: "id", header: "ID" },
        { key: "original_url", header: "Original URL" },
        { key: "short_code", header: "Short Code" },
        { key: "access_count", header: "Access Count" },
        { key: "created_at", header: "Created At" },
      ],
    });

    const passThrough = new PassThrough();

    const cursor = this.linksRepository.findAllStream();

    const convertToCSVPipeline = pipeline(
      cursor,
      new Transform({
        objectMode: true,
        transform(chunks: unknown[], encoding, callback) {
          for (const chunk of chunks) {
            this.push(chunk);
          }

          callback();
        },
      }),
      csv,
      passThrough,
    );

    const uploadToStorage = this.storageProvider.upload({
      fileName: `${new Date().toISOString()}-links.csv`,
      content: passThrough,
      contentType: "text/csv",
    });

    const [{ publicUrl }] = await Promise.all([
      uploadToStorage,
      convertToCSVPipeline,
    ]);

    return makeRight({ publicUrl });
  }
}
