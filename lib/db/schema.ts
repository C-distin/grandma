import { pgTable, text, timestamp, integer, uuid, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  images: text("images").array(),
  authorName: varchar("author_name", { length: 100 }).notNull().default("Margaret E. Kuofie"),
  authorAvatar: text("author_avatar"),
  category: varchar("category", { length: 100 }).notNull(),
  tags: text("tags").array().notNull(),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  readingTime: integer("reading_time").notNull().default(5),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
})

export const blogCategories = pgTable("blog_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 7 }).notNull().default("#3B82F6"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Zod schemas for validation
export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  slug: z.string().min(1, "Slug is required").max(255, "Slug too long"),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt too long"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  status: z.enum(["draft", "published", "archived"]),
  readingTime: z.number().min(1).default(5),
})

export const selectBlogPostSchema = createSelectSchema(blogPosts)

export const insertBlogCategorySchema = createInsertSchema(blogCategories, {
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug too long"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
})

export const selectBlogCategorySchema = createSelectSchema(blogCategories)

export type BlogPost = typeof blogPosts.$inferSelect
export type NewBlogPost = typeof blogPosts.$inferInsert
export type BlogCategory = typeof blogCategories.$inferSelect
export type NewBlogCategory = typeof blogCategories.$inferInsert