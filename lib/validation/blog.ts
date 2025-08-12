import { z } from "zod"

export const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Add blog title" }),
  slug: z.string().min(1, { message: "Add blog slug" }),
  excerpt: z
    .string()
    .min(1, { message: "Add blog excerpt" })
    .max(500, { message: "Excerpt must be less than 500 characters" }),
  content: z.string().min(1, { message: "Add blog content" }),
  featuredImage: z.string().optional(),
  authorName: z.string().default("Margaret E. Kuofie"),
  authorAvatar: z.string().optional(),
  readingTime: z.string().default("5"),
  views: z.string().default("0"),
  likes: z.string().default("0"),
  publishedAt: z.date().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type BlogPost = z.infer<typeof blogPostSchema>
