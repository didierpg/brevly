import { Readable } from "node:stream";

export interface UploadParams {
  fileName: string;
  content: Readable;
  contentType: string;
}

export interface UploadResult {
  publicUrl: string;
}

export interface StorageProvider {
  upload(params: UploadParams): Promise<UploadResult>;
}
