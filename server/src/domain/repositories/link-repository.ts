import { Link } from "@/domain/entities/link";

export interface LinkRepository {
  create(link: Link): Promise<void>;
  findByShortCode(code: string): Promise<Link | null>;
  findByShortCodeAndIncrementAccessCount(
    shortCode: string,
  ): Promise<string | null>;
  findAll(): Promise<Link[]>;
  delete(shortCode: string): Promise<boolean>;
  findAllStream(): AsyncIterable<Link>;
}
