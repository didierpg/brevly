import { Link } from "@/domain/entities/link";
import { LinkRecord } from "@/infra/db/schemas/links";
export class LinkMapper {
  static toDomain(raw: LinkRecord): Link {
    return new Link({
      id: raw.id,
      originalUrl: raw.originalUrl,
      shortCode: raw.shortCode,
      accessCount: raw.accessCount,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(link: Link): LinkRecord {
    return {
      id: link.id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      accessCount: link.accessCount,
      createdAt: link.createdAt,
    };
  }
}
