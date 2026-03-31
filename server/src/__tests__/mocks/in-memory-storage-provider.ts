import {
  StorageProvider,
  UploadParams,
  UploadResult,
} from "@/domain/storage/storage-provider";

export class InMemoryStorageProvider implements StorageProvider {
  async upload({ fileName }: UploadParams): Promise<UploadResult> {
    return {
      publicUrl: `https://storage.com/${fileName}`,
    };
  }
}
