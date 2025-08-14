import { z } from "zod"

// Zod schema for blog title validation
export const blogTitleSchema = z
  .string()
  .min(3, "Title must be at least 3 characters")
  .max(255, "Title must not exceed 255 characters")
  .regex(/^[a-zA-Z0-9\\s\\-_,.?!]+$/, "Title contains invalid characters")

/**
 * Generates a URL-friendly slug from a validated title
 */
export function slugify(title: string): string {
  const parsedTitle = blogTitleSchema.parse(title)

  return parsedTitle
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\\s-]/g, "") // Remove special characters
    .replace(/\\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
}
