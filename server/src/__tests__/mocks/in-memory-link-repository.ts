import { Link } from "@/domain/entities/link";
import { LinkRepository } from "@/domain/repositories/link-repository";

export class InMemoryLinkRepository implements LinkRepository {
  public items: Link[] = [];

  async create(link: Link): Promise<void> {
    this.items.push(link);
  }

  async findByShortCode(code: string): Promise<Link | null> {
    const link = this.items.find((item) => item.shortCode === code);
    return link ?? null;
  }
}
