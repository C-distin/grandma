import { pgTable, serial, text, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core"

export const postStatusEnum = pgEnum("status", ["draft", "published", "archived"])

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  coverUrl: text("cover_url"),
  status: postStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
