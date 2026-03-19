import { LinksRepository } from "@/domain/repositories/links-repository";
import { Link } from "@/domain/entities/link";
import { LinkMapper } from "../../../main/mappers/link-mapper";
import { links } from "../schemas/links";
import { eq } from "drizzle-orm";

export class DrizzleLinksRepository implements LinksRepository {
  constructor(
    private db: any,
    private pg: any,
  ) {}

  async save(link: Link): Promise<Link | null> {
    const persistenceLink = LinkMapper.toPersistence(link);
    const result = await this.db.insert(links).values(persistenceLink);
    return result.insertId
      ? LinkMapper.toDomain({ ...persistenceLink, id: result.insertId })
      : null;
  }

  async update(link: Link): Promise<void> {
    const persistenceLink = LinkMapper.toPersistence(link);
    await this.db
      .update(links)
      .set(persistenceLink)
      .where(eq(links.id, link.id));
  }

  async findById(id: string): Promise<Link | null> {
    const result = await this.db.select().from(links).where(eq(links.id, id));
    return result.length > 0 ? LinkMapper.toDomain(result[0]) : null;
  }
  async findByShortCode(code: string): Promise<Link | null> {
    const result = await this.db
      .select()
      .from(links)
      .where(eq(links.shortCode, code));
    return result.length > 0 ? LinkMapper.toDomain(result[0]) : null;
  }
  async findAll(): Promise<Link[]> {
    const result = await this.db.select().from(links);
    return result.map(LinkMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(links).where(eq(links.id, id));
  }

  findAllStream(): AsyncIterable<Link> {
    const query = this.db
      .select({
        id: links.id,
        originalUrl: links.originalUrl,
        shortCode: links.shortCode,
        accessCount: links.accessCount,
        createdAt: links.createdAt,
      })
      .from(links)
      .where()
      .toSQL();

    return this.pg.unsafe(query.sql, ...query.params).cursor();
  }
}
