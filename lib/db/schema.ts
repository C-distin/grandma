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
  tags: text("tags").array().notNull().default(["general"]),
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
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateBlogPostSchema = insertBlogPostSchema.partial().extend({
  id: z.string().uuid(),
})

export const selectBlogPostSchema = createSelectSchema(blogPosts)

export const insertBlogCategorySchema = createInsertSchema(blogCategories, {
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug too long"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateBlogCategorySchema = insertBlogCategorySchema.partial().extend({
  id: z.string().uuid(),
})

export const selectBlogCategorySchema = createSelectSchema(blogCategories)

// Query schemas for filtering and pagination
export const blogPostQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  category: z.string().optional(),
  tag: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "publishedAt", "views", "likes", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const blogCategoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(["name", "createdAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

// Type exports
export type BlogPost = typeof blogPosts.$inferSelect
export type NewBlogPost = typeof blogPosts.$inferInsert
export type BlogCategory = typeof blogCategories.$inferSelect
export type NewBlogCategory = typeof blogCategories.$inferInsert
export type BlogPostQuery = z.infer<typeof blogPostQuerySchema>
export type BlogCategoryQuery = z.infer<typeof blogCategoryQuerySchema>