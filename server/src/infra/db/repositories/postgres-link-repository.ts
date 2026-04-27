import { Link } from "@/domain/entities/link";
import { LinkRepository } from "@/domain/repositories/link-repository";
import { db, pg } from "..";
import { links } from "../schemas/links";
import { desc, eq, sql } from "drizzle-orm";

export class PostgresLinkRepository implements LinkRepository {
  async create(link: Link): Promise<void> {
    await db.insert(links).values(link);
  }

  async findByShortCode(code: string): Promise<Link | null> {
    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.shortCode, code));

    return link ?? null;
  }

  async findByShortCodeAndIncrementAccessCount(
    shortCode: string,
  ): Promise<string | null> {
    const [link] = await db
      .update(links)
      .set({
        accessCount: sql`${links.accessCount} + 1`,
      })
      .where(eq(links.shortCode, shortCode))
      .returning({ originalUrl: links.originalUrl });

    return link?.originalUrl ?? null;
  }

  async findAll(): Promise<Link[]> {
    return await db.select().from(links).orderBy(desc(links.createdAt));
  }

  async delete(shortCode: string): Promise<boolean> {
    const result = await db
      .delete(links)
      .where(eq(links.shortCode, shortCode))
      .returning();
    return result.length > 0;
  }

  async *findAllStream(): AsyncIterable<Link> {
    const query = db
      .select({
        id: links.id,
        originalUrl: links.originalUrl,
        shortCode: links.shortCode,
        accessCount: links.accessCount,
        createdAt: links.createdAt,
      })
      .from(links)
      .toSQL();

    const cursor = pg.unsafe(query.sql).cursor();

    for await (const rows of cursor) {
      for (const row of rows) {
        yield row as unknown as Link;
      }
    }
  }
}
