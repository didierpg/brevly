import { schema } from "@/infra/db/schemas";
import { links } from "@/infra/db/schemas/links";
import { Either, makeLeft, makeRight } from "@/main/shared/either";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type CreateLinkRequest = {
  originalUrl: string;
  shortCode: string;
};

type CreateLinkResponse = {
  id: string;
  originalUrl: string;
  shortCode: string;
  accessCount: number;
  createdAt: Date;
};
export class CreateLinkUseCase {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  async execute({
    originalUrl,
    shortCode,
  }: CreateLinkRequest): Promise<Either<Error, CreateLinkResponse>> {
    const existing = await this.db
      .select()
      .from(links)
      .where(eq(links.shortCode, shortCode));

    if (existing.length > 0) {
      return makeLeft(new Error("URL encurtada já existente"));
    }

    const [result] = await this.db
      .insert(links)
      .values({
        originalUrl,
        shortCode,
      })
      .returning();

    return makeRight({
      id: result.id,
      originalUrl: result.originalUrl,
      shortCode: result.shortCode,
      accessCount: result.accessCount,
      createdAt: result.createdAt,
    });
  }
}
