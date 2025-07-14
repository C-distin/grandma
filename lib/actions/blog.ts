"use server"

import { db } from "@/lib/db"
import { blogPosts, blogCategories, insertBlogPostSchema, type NewBlogPost, type BlogPost } from "@/lib/db/schema"
import { eq, desc, asc, ilike, and, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Create blog post action
export async function createBlogPost(formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      tags: JSON.parse(formData.get("tags") as string || "[]"),
      status: formData.get("status") as "draft" | "published",
      featuredImage: formData.get("featuredImage") as string || undefined,
    }

    // Validate the data
    const validatedData = insertBlogPostSchema.parse({
      ...data,
      slug: generateSlug(data.title),
      readingTime: calculateReadingTime(data.content),
      publishedAt: data.status === "published" ? new Date() : undefined,
    })

    // Insert into database
    const [newPost] = await db
      .insert(blogPosts)
      .values(validatedData)
      .returning()

    revalidatePath("/dashboard")
    revalidatePath("/blog")
    
    return { success: true, post: newPost }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create blog post" 
    }
  }
}

// Update blog post action
export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      tags: JSON.parse(formData.get("tags") as string || "[]"),
      status: formData.get("status") as "draft" | "published",
      featuredImage: formData.get("featuredImage") as string || undefined,
    }

    // Get existing post to preserve some fields
    const [existingPost] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1)

    if (!existingPost) {
      return { success: false, error: "Blog post not found" }
    }

    // Validate the data
    const validatedData = insertBlogPostSchema.parse({
      ...data,
      slug: data.title !== existingPost.title ? generateSlug(data.title) : existingPost.slug,
      readingTime: calculateReadingTime(data.content),
      publishedAt: data.status === "published" && !existingPost.publishedAt ? new Date() : existingPost.publishedAt,
      updatedAt: new Date(),
    })

    // Update in database
    const [updatedPost] = await db
      .update(blogPosts)
      .set(validatedData)
      .where(eq(blogPosts.id, id))
      .returning()

    revalidatePath("/dashboard")
    revalidatePath("/blog")
    revalidatePath(`/blog/${updatedPost.slug}`)
    
    return { success: true, post: updatedPost }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update blog post" 
    }
  }
}

// Delete blog post action
export async function deleteBlogPost(id: string) {
  try {
    const [deletedPost] = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning()

    if (!deletedPost) {
      return { success: false, error: "Blog post not found" }
    }

    revalidatePath("/dashboard")
    revalidatePath("/blog")
    
    return { success: true, post: deletedPost }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete blog post" 
    }
  }
}

// Get all blog posts with filtering and sorting
export async function getBlogPosts(options: {
  status?: "all" | "draft" | "published" | "archived"
  category?: string
  search?: string
  sortBy?: "newest" | "oldest" | "title" | "views"
  limit?: number
  offset?: number
} = {}) {
  try {
    const {
      status = "all",
      category,
      search,
      sortBy = "newest",
      limit,
      offset = 0
    } = options

    let query = db.select().from(blogPosts)

    // Apply filters
    const conditions = []
    
    if (status !== "all") {
      conditions.push(eq(blogPosts.status, status))
    }
    
    if (category) {
      conditions.push(eq(blogPosts.category, category))
    }
    
    if (search) {
      conditions.push(
        or(
          ilike(blogPosts.title, `%${search}%`),
          ilike(blogPosts.excerpt, `%${search}%`)
        )
      )
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        query = query.orderBy(asc(blogPosts.createdAt))
        break
      case "title":
        query = query.orderBy(asc(blogPosts.title))
        break
      case "views":
        query = query.orderBy(desc(blogPosts.views))
        break
      default: // newest
        query = query.orderBy(desc(blogPosts.createdAt))
        break
    }

    // Apply pagination
    if (limit) {
      query = query.limit(limit)
    }
    if (offset > 0) {
      query = query.offset(offset)
    }

    const posts = await query

    return { success: true, posts }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch blog posts",
      posts: []
    }
  }
}

// Get single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  try {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1)

    if (!post) {
      return { success: false, error: "Blog post not found", post: null }
    }

    // Increment view count
    await db
      .update(blogPosts)
      .set({ views: post.views + 1 })
      .where(eq(blogPosts.id, post.id))

    return { success: true, post: { ...post, views: post.views + 1 } }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch blog post",
      post: null
    }
  }
}

// Get blog categories
export async function getBlogCategories() {
  try {
    const categories = await db
      .select()
      .from(blogCategories)
      .orderBy(asc(blogCategories.name))

    return { success: true, categories }
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch categories",
      categories: []
    }
  }
}

// Increment post likes
export async function incrementPostLikes(id: string) {
  try {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ likes: blogPosts.likes + 1 })
      .where(eq(blogPosts.id, id))
      .returning()

    if (!updatedPost) {
      return { success: false, error: "Blog post not found" }
    }

    revalidatePath(`/blog/${updatedPost.slug}`)
    
    return { success: true, post: updatedPost }
  } catch (error) {
    console.error("Error incrementing likes:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to increment likes" 
    }
  }
}