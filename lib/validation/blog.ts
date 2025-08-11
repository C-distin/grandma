import { z } from "zod"

export const blogPostSchema = z.object({
  title: z.string().min(1, { message: "Add blog title" }),
  excerpt: z
    .string()
    .min(1, { message: "Add blog excerpt" })
    .max(200, { message: "Excerpt must be less than 200 characters" }),
  content: z.string().min(1, { message: "Add blog content" }),
  featuredImage: z.url({ message: "Add featured image" }).optional(),
  categoryId: z.uuid(),
  tags: z.array(z.uuid()),
  status: z.enum(["draft", "published", "archived"]),
})

export const blogCategorySchema = z.object({
  name: z.string().min(1, { message: "Add category name" }),
  description: z.string().min(1, { message: "Add category description" }),
  color: z.regex(/^#[0-9a-f]{6}$/i, { message: "Invalid Hex color" }),
})

export type BlogPost = z.infer<typeof blogPostSchema>
export type BlogCategory = z.infer<typeof blogCategorySchema>
