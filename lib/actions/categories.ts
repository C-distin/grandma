"use server"

import { db } from "@/lib/db"
import { blogCategories, insertBlogCategorySchema, type NewBlogCategory, type BlogCategory } from "@/lib/db/schema"
import { eq, desc, asc, ilike } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Create blog category action
export async function createBlogCategory(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      color: formData.get("color") as string,
    }

    // Validate the data
    const validatedData = insertBlogCategorySchema.parse({
      ...data,
      slug: generateSlug(data.name),
    })

    // Insert into database
    const [newCategory] = await db
      .insert(blogCategories)
      .values(validatedData)
      .returning()

    revalidatePath("/dashboard")
    
    return { success: true, category: newCategory }
  } catch (error) {
    console.error("Error creating blog category:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create blog category" 
    }
  }
}

// Update blog category action
export async function updateBlogCategory(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      color: formData.get("color") as string,
    }

    // Get existing category to preserve some fields
    const [existingCategory] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, id))
      .limit(1)

    if (!existingCategory) {
      return { success: false, error: "Blog category not found" }
    }

    // Validate the data
    const validatedData = insertBlogCategorySchema.parse({
      ...data,
      slug: data.name !== existingCategory.name ? generateSlug(data.name) : existingCategory.slug,
      updatedAt: new Date(),
    })

    // Update in database
    const [updatedCategory] = await db
      .update(blogCategories)
      .set(validatedData)
      .where(eq(blogCategories.id, id))
      .returning()

    revalidatePath("/dashboard")
    
    return { success: true, category: updatedCategory }
  } catch (error) {
    console.error("Error updating blog category:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update blog category" 
    }
  }
}

// Delete blog category action
export async function deleteBlogCategory(id: string) {
  try {
    const [deletedCategory] = await db
      .delete(blogCategories)
      .where(eq(blogCategories.id, id))
      .returning()

    if (!deletedCategory) {
      return { success: false, error: "Blog category not found" }
    }

    revalidatePath("/dashboard")
    
    return { success: true, category: deletedCategory }
  } catch (error) {
    console.error("Error deleting blog category:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete blog category" 
    }
  }
}

// Get all blog categories with filtering and sorting
export async function getAllBlogCategories(options: {
  search?: string
  sortBy?: "name" | "created"
  limit?: number
  offset?: number
} = {}) {
  try {
    const {
      search,
      sortBy = "name",
      limit,
      offset = 0
    } = options

    let query = db.select().from(blogCategories)

    // Apply search filter
    if (search) {
      query = query.where(ilike(blogCategories.name, `%${search}%`))
    }

    // Apply sorting
    switch (sortBy) {
      case "created":
        query = query.orderBy(desc(blogCategories.createdAt))
        break
      default: // name
        query = query.orderBy(asc(blogCategories.name))
        break
    }

    // Apply pagination
    if (limit) {
      query = query.limit(limit)
    }
    if (offset > 0) {
      query = query.offset(offset)
    }

    const categories = await query

    return { success: true, categories }
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch blog categories",
      categories: []
    }
  }
}

// Get single blog category by ID
export async function getBlogCategoryById(id: string) {
  try {
    const [category] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, id))
      .limit(1)

    if (!category) {
      return { success: false, error: "Blog category not found", category: null }
    }

    return { success: true, category }
  } catch (error) {
    console.error("Error fetching blog category:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch blog category",
      category: null
    }
  }
}