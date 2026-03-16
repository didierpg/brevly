import { Link } from "@/domain/entities/link";

export interface LinksRepository {
  save(link: Link): Promise<Link | null>;
  findById(id: string): Promise<Link | null>;
  findByShortCode(code: string): Promise<Link | null>;
  findAll(): Promise<Link[]>;
  delete(id: string): Promise<void>;
}
