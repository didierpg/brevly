import { Link } from "@/domain/entities/link";
import { LinkRepository } from "@/domain/repositories/link-repository";
import { db } from "..";
import { links } from "../schemas/links";
import { eq } from "drizzle-orm";

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
}
