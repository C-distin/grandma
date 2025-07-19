"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { blogPosts, blogCategories } from "@/lib/db/schema"
import { eq, and, or, like, desc, asc, count } from "drizzle-orm"
import type { BlogPostQuery, BlogCategoryQuery } from "@/lib/db/schema"

// Blog Posts Actions
export async function getBlogPosts(query: BlogPostQuery) {
  try {
    const whereConditions = []

    // Apply filters
    if (query.category) {
      whereConditions.push(eq(blogPosts.category, query.category))
    }

    if (query.status) {
      whereConditions.push(eq(blogPosts.status, query.status))
    }

    if (query.tag) {
      // Note: This assumes tags are stored as an array. Adjust based on your DB setup
      whereConditions.push(like(blogPosts.tags, `%${query.tag}%`))
    }

    if (query.search) {
      const searchTerm = `%${query.search}%`
      whereConditions.push(
        or(like(blogPosts.title, searchTerm), like(blogPosts.excerpt, searchTerm), like(blogPosts.content, searchTerm))
      )
    }

    // Build the where clause
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Determine sort order
    let orderBy
    switch (query.sortBy) {
      case "publishedAt":
        orderBy = query.sortOrder === "desc" ? desc(blogPosts.publishedAt) : asc(blogPosts.publishedAt)
        break
      case "views":
        orderBy = query.sortOrder === "desc" ? desc(blogPosts.views) : asc(blogPosts.views)
        break
      case "likes":
        orderBy = query.sortOrder === "desc" ? desc(blogPosts.likes) : asc(blogPosts.likes)
        break
      case "title":
        orderBy = query.sortOrder === "desc" ? desc(blogPosts.title) : asc(blogPosts.title)
        break
      default:
        orderBy = query.sortOrder === "desc" ? desc(blogPosts.createdAt) : asc(blogPosts.createdAt)
    }

    // Execute query with pagination
    const offset = (query.page - 1) * query.limit
    const posts = await db
      .select()
      .from(blogPosts)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(query.limit)
      .offset(offset)

    return { success: true, data: posts }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return { success: false, error: "Failed to fetch blog posts" }
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
      .limit(1)

    if (post.length === 0) {
      return { success: false, error: "Post not found" }
    }

    return { success: true, data: post[0] }
  } catch (error) {
    console.error("Error fetching blog post by slug:", error)
    return { success: false, error: "Failed to fetch blog post" }
  }
}

export async function createBlogPost(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const tags = JSON.parse(formData.get("tags") as string)
    const status = formData.get("status") as "draft" | "published" | "archived"
    const featuredImage = formData.get("featuredImage") as string | null

    // Calculate reading time (approximate: 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const newPost = await db
      .insert(blogPosts)
      .values({
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        status,
        featuredImage,
        publishedAt: status === "published" ? new Date() : null,
        readingTime,
        views: 0,
        likes: 0,
      })
      .returning()

    revalidatePath("/dashboard")
    revalidatePath("/blog")
    return { success: true, data: newPost[0] }
  } catch (error) {
    console.error("Error creating blog post:", error)

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("unique")) {
      return { success: false, error: "A post with this slug already exists" }
    }

    return { success: false, error: "Failed to create blog post" }
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const tags = JSON.parse(formData.get("tags") as string)
    const status = formData.get("status") as "draft" | "published" | "archived"
    const featuredImage = formData.get("featuredImage") as string | null

    // Calculate reading time
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Get current post to check if we need to set publishedAt
    const currentPost = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1)

    if (currentPost.length === 0) {
      return { success: false, error: "Post not found" }
    }

    const updatedPost = await db
      .update(blogPosts)
      .set({
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        status,
        featuredImage,
        publishedAt: status === "published" && !currentPost[0].publishedAt ? new Date() : currentPost[0].publishedAt,
        readingTime,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning()

    revalidatePath("/dashboard")
    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)
    return { success: true, data: updatedPost[0] }
  } catch (error) {
    console.error("Error updating blog post:", error)

    if (error instanceof Error && error.message.includes("unique")) {
      return { success: false, error: "A post with this slug already exists" }
    }

    return { success: false, error: "Failed to update blog post" }
  }
}

export async function archiveBlogPost(id: string) {
  try {
    const updatedPost = await db
      .update(blogPosts)
      .set({
        status: "archived",
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning()

    if (updatedPost.length === 0) {
      return { success: false, error: "Post not found" }
    }

    revalidatePath("/dashboard")
    revalidatePath("/blog")
    return { success: true, data: updatedPost[0] }
  } catch (error) {
    console.error("Error archiving blog post:", error)
    return { success: false, error: "Failed to archive blog post" }
  }
}

export async function restoreBlogPost(id: string, newStatus: "draft" | "published" = "draft") {
  try {
    const updatedPost = await db
      .update(blogPosts)
      .set({
        status: newStatus,
        publishedAt: newStatus === "published" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning()

    if (updatedPost.length === 0) {
      return { success: false, error: "Post not found" }
    }

    revalidatePath("/dashboard")
    revalidatePath("/blog")
    return { success: true, data: updatedPost[0] }
  } catch (error) {
    console.error("Error restoring blog post:", error)
    return { success: false, error: "Failed to restore blog post" }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const deletedPost = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning()

    if (deletedPost.length === 0) {
      return { success: false, error: "Post not found" }
    }

    revalidatePath("/dashboard")
    revalidatePath("/blog")
    return { success: true }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, error: "Failed to delete blog post" }
  }
}

export async function incrementPostViews(id: string) {
  try {
    await db
      .update(blogPosts)
      .set({
        views: db
          .select({ views: blogPosts.views })
          .from(blogPosts)
          .where(eq(blogPosts.id, id))
          .then(result => (result[0]?.views || 0) + 1),
      })
      .where(eq(blogPosts.id, id))

    return { success: true }
  } catch (error) {
    console.error("Error incrementing post views:", error)
    return { success: false, error: "Failed to increment views" }
  }
}

export async function togglePostLike(id: string) {
  try {
    // This is a simplified version - in a real app, you'd track user likes
    const currentPost = await db.select({ likes: blogPosts.likes }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1)

    if (currentPost.length === 0) {
      return { success: false, error: "Post not found" }
    }

    await db
      .update(blogPosts)
      .set({
        likes: currentPost[0].likes + 1,
      })
      .where(eq(blogPosts.id, id))

    return { success: true }
  } catch (error) {
    console.error("Error toggling post like:", error)
    return { success: false, error: "Failed to toggle like" }
  }
}

// Blog Categories Actions
export async function getBlogCategories(query: BlogCategoryQuery) {
  try {
    const whereConditions = []

    if (query.search) {
      const searchTerm = `%${query.search}%`
      whereConditions.push(or(like(blogCategories.name, searchTerm), like(blogCategories.description, searchTerm)))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Determine sort order
    let orderBy
    switch (query.sortBy) {
      case "name":
        orderBy = query.sortOrder === "desc" ? desc(blogCategories.name) : asc(blogCategories.name)
        break
      default:
        orderBy = query.sortOrder === "desc" ? desc(blogCategories.createdAt) : asc(blogCategories.createdAt)
    }

    const offset = (query.page - 1) * query.limit
    const categories = await db
      .select()
      .from(blogCategories)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(query.limit)
      .offset(offset)

    return { success: true, data: categories }
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return { success: false, error: "Failed to fetch blog categories" }
  }
}

export async function createBlogCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const color = formData.get("color") as string

    const newCategory = await db
      .insert(blogCategories)
      .values({
        name,
        slug,
        description,
        color,
      })
      .returning()

    revalidatePath("/dashboard")
    return { success: true, data: newCategory[0] }
  } catch (error) {
    console.error("Error creating blog category:", error)

    if (error instanceof Error && error.message.includes("unique")) {
      return { success: false, error: "A category with this name or slug already exists" }
    }

    return { success: false, error: "Failed to create blog category" }
  }
}

export async function updateBlogCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const color = formData.get("color") as string

    const updatedCategory = await db
      .update(blogCategories)
      .set({
        name,
        slug,
        description,
        color,
        updatedAt: new Date(),
      })
      .where(eq(blogCategories.id, id))
      .returning()

    if (updatedCategory.length === 0) {
      return { success: false, error: "Category not found" }
    }

    revalidatePath("/dashboard")
    return { success: true, data: updatedCategory[0] }
  } catch (error) {
    console.error("Error updating blog category:", error)

    if (error instanceof Error && error.message.includes("unique")) {
      return { success: false, error: "A category with this name or slug already exists" }
    }

    return { success: false, error: "Failed to update blog category" }
  }
}

export async function deleteBlogCategory(id: string) {
  try {
    // Check if any posts are using this category
    const postsUsingCategory = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(
        eq(
          blogPosts.category,
          db.select({ name: blogCategories.name }).from(blogCategories).where(eq(blogCategories.id, id)).limit(1)
        )
      )

    if (postsUsingCategory[0]?.count > 0) {
      return { success: false, error: "Cannot delete category that is being used by posts" }
    }

    const deletedCategory = await db.delete(blogCategories).where(eq(blogCategories.id, id)).returning()

    if (deletedCategory.length === 0) {
      return { success: false, error: "Category not found" }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting blog category:", error)
    return { success: false, error: "Failed to delete blog category" }
  }
}

// Analytics and Statistics
export async function getBlogStats() {
  try {
    const [totalPosts, publishedPosts, draftPosts, archivedPosts, totalViews, totalLikes] = await Promise.all([
      db.select({ count: count() }).from(blogPosts),
      db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.status, "published")),
      db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.status, "draft")),
      db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.status, "archived")),
      db.select({ total: blogPosts.views }).from(blogPosts),
      db.select({ total: blogPosts.likes }).from(blogPosts),
    ])

    const stats = {
      totalPosts: totalPosts[0]?.count || 0,
      publishedPosts: publishedPosts[0]?.count || 0,
      draftPosts: draftPosts[0]?.count || 0,
      archivedPosts: archivedPosts[0]?.count || 0,
      totalViews: totalViews.reduce((sum, post) => sum + (post.total || 0), 0),
      totalLikes: totalLikes.reduce((sum, post) => sum + (post.total || 0), 0),
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error fetching blog stats:", error)
    return { success: false, error: "Failed to fetch blog statistics" }
  }
}

export async function getTopPosts(limit = 5) {
  try {
    const topPosts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.views))
      .limit(limit)

    return { success: true, data: topPosts }
  } catch (error) {
    console.error("Error fetching top posts:", error)
    return { success: false, error: "Failed to fetch top posts" }
  }
}
