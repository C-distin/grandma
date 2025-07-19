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

export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  size: integer("size").notNull(),
  width: integer("width"),
  height: integer("height"),
  tags: text("tags").array().default([]),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
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

export const insertGalleryImageSchema = createInsertSchema(galleryImages, {
  url: z.string().url("Invalid URL"),
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  title: z.string().max(255, "Title too long").optional(),
  description: z.string().optional(),
  size: z.number().min(1, "Size must be positive"),
  width: z.number().min(1).optional(),
  height: z.number().min(1).optional(),
  tags: z.array(z.string()).default([]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateGalleryImageSchema = insertGalleryImageSchema.partial().extend({
  id: z.string().uuid(),
})

export const selectGalleryImageSchema = createSelectSchema(galleryImages)

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

export const galleryImageQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  tag: z.string().optional(),
  sortBy: z.enum(["uploadedAt", "name", "size"]).default("uploadedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

// Type exports
export type BlogPost = typeof blogPosts.$inferSelect
export type NewBlogPost = typeof blogPosts.$inferInsert
export type BlogCategory = typeof blogCategories.$inferSelect
export type NewBlogCategory = typeof blogCategories.$inferInsert
export type GalleryImage = typeof galleryImages.$inferSelect
export type NewGalleryImage = typeof galleryImages.$inferInsert
export type BlogPostQuery = z.infer<typeof blogPostQuerySchema>
export type BlogCategoryQuery = z.infer<typeof blogCategoryQuerySchema>
export type GalleryImageQuery = z.infer<typeof galleryImageQuerySchema>
