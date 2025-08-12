"use server"

import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { BlogPost } from "@/lib/validation/blog"

/**
 * Fetch all posts
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const result = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt))
    
    return result.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage || undefined,
      authorName: post.authorName,
      authorAvatar: post.authorAvatar || undefined,
      readingTime: post.readingTime,
      views: post.views,
      likes: post.likes,
      publishedAt: post.publishedAt || undefined,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }))
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

/**
 * Fetch post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)
    
    if (!post) return null
    
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage || undefined,
      authorName: post.authorName,
      authorAvatar: post.authorAvatar || undefined,
      readingTime: post.readingTime,
      views: post.views,
      likes: post.likes,
      publishedAt: post.publishedAt || undefined,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
  } catch (error) {
    console.error("Error fetching post by slug:", error)
    return null
  }
}

/**
 * Fetch published posts
 */
export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  try {
    let query = db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.publishedAt))
    
    if (limit) {
      query = query.limit(limit) as any
    }
    
    const result = await query
    
    return result.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage || undefined,
      authorName: post.authorName,
      authorAvatar: post.authorAvatar || undefined,
      readingTime: post.readingTime,
      views: post.views,
      likes: post.likes,
      publishedAt: post.publishedAt || undefined,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }))
  } catch (error) {
    console.error("Error fetching published posts:", error)
    return []
  }
}

/**
 * Create new post
 */
export async function createPost(data: {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  status?: "draft" | "published" | "archived"
}): Promise<void> {
  try {
    const publishedAt = data.status === "published" ? new Date() : null
    
    await db.insert(blogPosts).values({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      status: data.status ?? "draft",
      publishedAt,
    })

    revalidatePath("/dashboard")
    revalidatePath("/blog")
  } catch (error) {
    console.error("Error creating post:", error)
    throw new Error("Failed to create post")
  }
}

/**
 * Update post
 */
export async function updatePost(
  id: string,
  data: Partial<{
    title: string
    slug: string
    excerpt: string
    content: string
    featuredImage: string
    status: "draft" | "published" | "archived"
  }>
): Promise<void> {
  try {
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    }
    
    // Set publishedAt when publishing for the first time
    if (data.status === "published") {
      const [existingPost] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1)
      if (existingPost && !existingPost.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }

    await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))

    revalidatePath("/dashboard")
    revalidatePath("/blog")
  } catch (error) {
    console.error("Error updating post:", error)
    throw new Error("Failed to update post")
  }
}

/**
 * Delete post
 */
export async function deletePost(id: string): Promise<void> {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id))
    revalidatePath("/dashboard")
    revalidatePath("/blog")
  } catch (error) {
    console.error("Error deleting post:", error)
    throw new Error("Failed to delete post")
  }
}