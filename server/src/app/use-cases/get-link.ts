import { schema } from "@/infra/db/schemas";
import { links } from "@/infra/db/schemas/links";
import { Either, makeLeft, makeRight } from "@/main/shared/either";
import { eq, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type GetLinkRequest = {
  shortCode: string;
};

export class GetLinkUseCase {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  async execute({
    shortCode,
  }: GetLinkRequest): Promise<Either<Error, { originalUrl: string }>> {
    const [link] = await this.db
      .update(links)
      .set({ accessCount: sql`${links.accessCount} + 1` })
      .where(eq(links.shortCode, shortCode))
      .returning({ originalUrl: links.originalUrl });

    if (!link) return makeLeft(new Error("Link not found"));

    return makeRight({ originalUrl: link.originalUrl });
  }
}
