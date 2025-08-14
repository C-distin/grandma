import { z } from "zod"

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  coverUrl: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type Post = z.infer<typeof postSchema>
