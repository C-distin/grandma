"use server"

import { db } from "@/lib/db"
import { blogPosts, blogCategories, insertBlogPostSchema, blogPostQuerySchema, type NewBlogPost, type BlogPost, type BlogPostQuery } from "@/lib/db/schema"
import { eq, desc, asc, ilike, and, or, sql } from "drizzle-orm"
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
      error: error instanceof z.ZodError ? error.flatten() : (error instanceof Error ? error.message : "Failed to create blog post")
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
      .select({ 
        title: blogPosts.title, 
        slug: blogPosts.slug, 
        publishedAt: blogPosts.publishedAt 
      })
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
      error: error instanceof z.ZodError ? error.flatten() : (error instanceof Error ? error.message : "Failed to update blog post") 
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
export async function getBlogPosts(searchParams: {
  status?: "draft" | "published" | "archived"
  category?: string
  tag?: string
  search?: string
  sortBy?: "newest" | "oldest" | "title" | "views"
  page?: number
  limit?: number
} = {}) {
  try {
    // Set defaults and validate
    const page = searchParams.page || 1
    const limit = searchParams.limit || 10
    const { status, category, tag, search, sortBy } = searchParams

    const offset = (page - 1) * limit

    // Check database connection
    if (!db) {
      return {
        success: false,
        error: "Database connection not available",
        posts: [],
      }
    }

    /* ---------- WHERE clause ---------- */
    const conditions = []

    if (status) conditions.push(eq(blogPosts.status, status))
    if (category) conditions.push(eq(blogPosts.category, category))
    if (tag) conditions.push(sql`${tag} = ANY(${blogPosts.tags})`)
    if (search) {
      conditions.push(
        or(
          ilike(blogPosts.title, `%${search}%`),
          ilike(blogPosts.excerpt, `%${search}%`)
        )
      )
    }

    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined

    /* ---------- ORDER clause ---------- */
    let orderByClause
    switch (sortBy) {
      case "oldest":
        orderByClause = asc(blogPosts.createdAt)
        break
      case "title":
        orderByClause = asc(blogPosts.title)
        break
      case "views":
        orderByClause = desc(blogPosts.views)
        break
      default: // newest
        orderByClause = desc(blogPosts.createdAt)
        break
    }

    /* ---------- Query execution ---------- */
    const rows = await db
      .select()
      .from(blogPosts)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset)

    return {
      success: true,
      posts: rows,
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      posts: [],
    }
  }
}

// Get single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  try {
    // First, try to find the post
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1)

    if (!post) {
      return { success: false, error: "Blog post not found", post: null }
    }

    // If it's a published post, increment the view count
    if (post.status === "published") {
      await db
        .update(blogPosts)
        .set({ views: sql`${blogPosts.views} + 1` })
        .where(eq(blogPosts.id, post.id))
      
      // Return the post with incremented views
      return { 
        success: true, 
        post: { ...post, views: post.views + 1 }
      }
    }

    // Return draft post without incrementing views
    return { success: true, post }
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
    // Check if database connection is available
    if (!db) {
      return { 
        success: false, 
        error: "Database connection not available",
        categories: []
      }
    }

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
    // Perform an atomic update to prevent race conditions
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ likes: sql`${blogPosts.likes} + 1` })
      .where(eq(blogPosts.id, id))
      .returning()

    if (!updatedPost) {
      return { success: false, error: "Blog post not found" }
    }

    // Revalidate the path for the specific post
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