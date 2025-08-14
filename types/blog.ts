export type BlogStatus = "draft" | "published" | "archived"

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  coverUrl?: string
  status: BlogStatus
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface BlogPostInput {
  title: string
  content: string
  coverUrl?: string
  status?: BlogStatus
}

export interface PaginatedBlogs {
  posts: BlogPost[]
  hasMore: boolean
}
