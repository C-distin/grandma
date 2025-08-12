import { z } from "zod"

export const blogPostSchema = z.object({
  title: z.string().min(1, { message: "Add blog title" }),
  slug: z.string().min(1, { message: "Add blog slug" }),
  excerpt: z
    .string()
    .min(1, { message: "Add blog excerpt" })
    .max(200, { message: "Excerpt must be less than 200 characters" }),
  content: z.string().min(1, { message: "Add blog content" }),
  featuredImage: z.url({ message: "Add featured image" }).optional(),
  status: z.enum(["draft", "published", "archived"]),
})

export type BlogPost = z.infer<typeof blogPostSchema>
