"use server"

import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

/**
 * Upload image to Supabase Storage and return public URL
 */
async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const { data, error } = await supabase.storage.from("blog-images").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage.from("blog-images").getPublicUrl(data.path)

  return publicUrlData.publicUrl
}

/**
 * Fetch all posts
 */
export async function getAllPosts() {
  return await db.select().from(blogPosts).orderBy(blogPosts.createdAt)
}

/**
 * Fetch post by slug
 */
export async function getPostBySlug(slug: string) {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)
  return post
}

/**
 * Fetch featured posts (published + has image)
 */
export async function getFeaturedPosts(limit: number = 5) {
  return await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), isNotNull(blogPosts.featuredImage)))
    .orderBy(blogPosts.createdAt)
    .limit(limit)
}

/**
 * Fetch archived posts
 */
export async function getArchivedPosts() {
  return await db.select().from(blogPosts).where(eq(blogPosts.status, "archived")).orderBy(blogPosts.createdAt)
}

/**
 * Fetch draft posts
 */
export async function getDraftPosts() {
  return await db.select().from(blogPosts).where(eq(blogPosts.status, "draft")).orderBy(blogPosts.createdAt)
}

/**
 * Create new post
 */
export async function createPost(data: {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImageFile?: File
  status?: "draft" | "published" | "archived"
}) {
  let imageUrl: string | undefined

  if (data.featuredImageFile) {
    imageUrl = await uploadImage(data.featuredImageFile)
  }

  await db.insert(blogPosts).values({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    featuredImage: imageUrl,
    status: data.status ?? "draft",
  })

  revalidatePath("/dashboard/blog")
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
    featuredImageFile: File
    status: "draft" | "published" | "archived"
  }>
) {
  let imageUrl: string | undefined

  if (data.featuredImageFile) {
    imageUrl = await uploadImage(data.featuredImageFile)
  }

  await db
    .update(blogPosts)
    .set({
      ...data,
      featuredImage: imageUrl ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))

  revalidatePath("/dashboard/blog")
}

/**
 * Delete post
 */
export async function deletePost(id: string) {
  await db.delete(blogPosts).where(eq(blogPosts.id, id))
  revalidatePath("/dashboard/blog")
}
