import { pipeline } from "node:stream/promises";
import { stringify } from "csv-stringify";
import { PassThrough } from "node:stream";
import { LinkRepository } from "@/domain/repositories/link-repository";
import {
  StorageProvider,
  UploadParams,
  UploadResult,
} from "@/domain/storage/storage-provider";
import { Either, makeRight } from "@/core/either";

export const exportLinksUseCase = (
  linksRepository: LinkRepository,
  storageProvider: StorageProvider,
) => {
  return async (): Promise<Either<never, UploadResult>> => {
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

    const cursor = linksRepository.findAllStream();

    const convertToCSVPipeline = pipeline(cursor, csv, passThrough);

    const uploadToStorage = storageProvider.upload({
      fileName: `${new Date().toISOString()}-links.csv`,
      content: passThrough,
      contentType: "text/csv",
    });

    const [result] = await Promise.all([uploadToStorage, convertToCSVPipeline]);

    return makeRight(result);
  };
};
