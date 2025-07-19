"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { galleryImages } from "@/lib/db/schema"
import { eq, and, or, like, desc, asc } from "drizzle-orm"
import type { GalleryImageQuery, NewGalleryImage } from "@/lib/db/schema"

export async function getGalleryImages(query: GalleryImageQuery) {
  try {
    const whereConditions = []

    if (query.search) {
      const searchTerm = `%${query.search}%`
      whereConditions.push(
        or(
          like(galleryImages.name, searchTerm),
          like(galleryImages.title, searchTerm),
          like(galleryImages.description, searchTerm)
        )
      )
    }

    if (query.tag) {
      // Note: This assumes tags are stored as an array
      whereConditions.push(like(galleryImages.tags, `%${query.tag}%`))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Determine sort order
    let orderBy
    switch (query.sortBy) {
      case "name":
        orderBy = query.sortOrder === "desc" ? desc(galleryImages.name) : asc(galleryImages.name)
        break
      case "size":
        orderBy = query.sortOrder === "desc" ? desc(galleryImages.size) : asc(galleryImages.size)
        break
      default:
        orderBy = query.sortOrder === "desc" ? desc(galleryImages.uploadedAt) : asc(galleryImages.uploadedAt)
    }

    const offset = (query.page - 1) * query.limit
    const images = await db
      .select()
      .from(galleryImages)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(query.limit)
      .offset(offset)

    return { success: true, data: images }
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return { success: false, error: "Failed to fetch gallery images" }
  }
}

export async function createGalleryImage(imageData: NewGalleryImage) {
  try {
    const newImage = await db.insert(galleryImages).values(imageData).returning()

    revalidatePath("/gallery")
    revalidatePath("/dashboard")
    return { success: true, data: newImage[0] }
  } catch (error) {
    console.error("Error creating gallery image:", error)
    return { success: false, error: "Failed to save image to gallery" }
  }
}

export async function updateGalleryImage(id: string, imageData: Partial<NewGalleryImage>) {
  try {
    const updatedImage = await db
      .update(galleryImages)
      .set({
        ...imageData,
        updatedAt: new Date(),
      })
      .where(eq(galleryImages.id, id))
      .returning()

    if (updatedImage.length === 0) {
      return { success: false, error: "Image not found" }
    }

    revalidatePath("/gallery")
    revalidatePath("/dashboard")
    return { success: true, data: updatedImage[0] }
  } catch (error) {
    console.error("Error updating gallery image:", error)
    return { success: false, error: "Failed to update image" }
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    const deletedImage = await db.delete(galleryImages).where(eq(galleryImages.id, id)).returning()

    if (deletedImage.length === 0) {
      return { success: false, error: "Image not found" }
    }

    revalidatePath("/gallery")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting gallery image:", error)
    return { success: false, error: "Failed to delete image" }
  }
}
