import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalUrl: text("original_url").notNull(),
  shortCode: text("short_code").notNull().unique(),
  accessCount: integer("access_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull(),
});
