import { Link } from "@/domain/entities/link";

export interface LinkRepository {
  create(link: Link): Promise<void>;
  findByShortCode(code: string): Promise<Link | null>;
}
