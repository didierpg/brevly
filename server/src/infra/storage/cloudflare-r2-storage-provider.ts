import { S3Client } from "@aws-sdk/client-s3";
import {
  StorageProvider,
  UploadParams,
  UploadResult,
} from "@/domain/storage/storage-provider";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "@/env";

export class CloudflareR2StorageProvider implements StorageProvider {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
    });
  }

  async upload({
    fileName,
    content,
    contentType,
  }: UploadParams): Promise<UploadResult> {
    const upload = await new Upload({
      client: this.client,
      params: {
        Bucket: process.env.CLOUDFLARE_BUCKET,
        Key: fileName,
        Body: content,
        ContentType: contentType,
      },
    });
    await upload.done();
    return {
      publicUrl: `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`,
    };
  }
}
