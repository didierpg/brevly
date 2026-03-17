import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalUrl: text("original_url").notNull(),
  shortCode: text("short_code").notNull().unique(),
  accessCount: integer("access_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type LinkRecord = typeof links.$inferSelect;
export type NewLinkRecord = typeof links.$inferInsert;
export type LinkUpdateRecord = Partial<typeof links.$inferInsert>;
export type LinkId = LinkRecord["id"];
export type LinkShortCode = LinkRecord["shortCode"];
export type LinkOriginalUrl = LinkRecord["originalUrl"];
export type LinkAccessCount = LinkRecord["accessCount"];
export type LinkCreatedAt = LinkRecord["createdAt"];
export type Link = {
  id: LinkId;
  originalUrl: LinkOriginalUrl;
  shortCode: LinkShortCode;
  accessCount: LinkAccessCount;
  createdAt: LinkCreatedAt;
};
