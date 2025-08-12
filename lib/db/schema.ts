import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const postStatusEnum = pgEnum("status", ["draft", "published", "archived"])

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image_url"),
  authorName: varchar("author_name", { length: 100 }).notNull().default("Margaret E. Kuofie"),
  authorAvatar: text("author_avatar"),
  readingTime: varchar("reading_time", { length: 20 }).notNull().default("5"),
  views: varchar("views", { length: 20 }).notNull().default("0"),
  likes: varchar("likes", { length: 20 }).notNull().default("0"),
  publishedAt: timestamp("published_at"),
  status: postStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
