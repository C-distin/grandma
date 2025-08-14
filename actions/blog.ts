"use server"

import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import slugify from "slugify"

export async function getAllPosts() {
  return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt))
}

export async function getPostById(id: number) {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id))
  return post
}

export async function getPublishedPosts() {
  return await db.select().from(blogPosts).where(eq(blogPosts.status, "published"))
}

export async function getArchivedPosts() {
  return db.select().from(blogPosts).where(eq(blogPosts.status, "archived"))
}

export async function getDraftPosts() {
  return db.select().from(blogPosts).where(eq(blogPosts.status, "draft"))
}

export async function getPostBySlug(slug: string) {
  const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)
  return post[0] || null
}

export async function createPost({
  title,
  // slug,
  content,
  coverUrl,
  status,
}: {
  title: string
  slug: string
  content: string
  coverUrl?: string
  status: "draft" | "published" | "archived"
}) {
  const slugifiedTitle = slugify(title, { lower: true, strict: true })
  await db.insert(blogPosts).values({
    title,
    slug: slugifiedTitle,
    content,
    coverUrl,
    status: status || "draft",
  })
  revalidatePath("/dashboard")
}

export async function updatePost(
  id: number,
  data: Partial<{ title: string; content: string; coverUrl: string; status: "draft" | "published" | "archived" }>
) {
  await db
    .update(blogPosts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
  revalidatePath("/dashboard")
}

export async function deletePost(id: number) {
  await db.delete(blogPosts).where(eq(blogPosts.id, id))
  revalidatePath("/dashboard")
}
