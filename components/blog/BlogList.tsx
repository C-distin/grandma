import { BlogCard } from "./BlogCard"
import type { BlogPost } from "@/types/blog"

export function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <BlogCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  )
}
