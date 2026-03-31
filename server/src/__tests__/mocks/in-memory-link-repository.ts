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

  async findByShortCodeAndIncrementAccessCount(
    shortCode: string,
  ): Promise<string | null> {
    const index = this.items.findIndex((item) => item.shortCode === shortCode);

    if (index === -1) return null;

    this.items[index].accessCount += 1;

    return this.items[index].originalUrl;
  }

  async findAll(): Promise<Link[]> {
    return this.items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  async *findAllStream(): AsyncIterable<Link> {
    for (const item of this.items) {
      yield item;
    }
  }
}
