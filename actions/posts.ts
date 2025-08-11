"use server"

import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { GenerateSlug } from "@/lib/utils"
import type { BlogPost } from "@/lib/validation/blog"
import { blogPostSchema } from "@/lib/validation/blog"

export async function createBlogPost(formData: BlogPost) {
  "use server"

  const data = blogPostSchema.parse(formData)
  const slug = GenerateSlug(data.title)

  try {
    const [_post] = await db.insert(blogPosts).values({
      ...data,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return { success: false, error: "Failed to create blog post" }
  }
}

export async function updateBlogPost(_id: string, _formData: BlogPost) {}
