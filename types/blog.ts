import type { BlogCategory as DBBlogCategory, BlogPost as DBBlogPost } from "@/lib/db/schema"

export type BlogPost = DBBlogPost
export type BlogCategory = DBBlogCategory

export interface CreatePostData {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  featuredImage?: string
  status: "draft" | "published"
}

export interface PostFilters {
  status?: "all" | "draft" | "published" | "archived"
  category?: string
  search?: string
  sortBy?: "newest" | "oldest" | "title" | "views"
}
