export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  images: string[]
  author: {
    name: string
    avatar?: string
  }
  category: string
  tags: string[]
  status: "draft" | "published" | "archived"
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  readingTime: number
  views: number
  likes: number
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color: string
}

export interface CreatePostData {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  featuredImage?: File
  images?: File[]
  status: "draft" | "published"
}

export interface PostFilters {
  status?: "all" | "draft" | "published" | "archived"
  category?: string
  search?: string
  sortBy?: "newest" | "oldest" | "title" | "views"
}
