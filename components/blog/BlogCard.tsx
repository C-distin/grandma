import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { BlogPost } from "@/types/blog"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const createExcerpt = (content: string, maxLength = 120): string => {
    const plainText = content.replace(/<[^>]+>/g, "")
    return plainText.length > maxLength ? `${plainText.slice(0, maxLength)}...` : plainText
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {post.coverUrl && (
        <div className="relative w-full h-48">
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardContent className="p-4">
        <Link
          href={`/blog/${post.slug}`}
          className="block"
        >
          <h3 className="text-lg font-semibold line-clamp-2 hover:underline">{post.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{createExcerpt(post.content)}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between px-4 py-2 border-t">
        <time
          className="text-xs text-muted-foreground"
          dateTime={new Date(post.createdAt).toISOString()}
        >
          {new Date(post.createdAt).toLocaleDateString()}
        </time>
        <Badge variant={post.status === "published" ? "default" : post.status === "draft" ? "secondary" : "outline"}>
          {post.status}
        </Badge>
      </CardFooter>
    </Card>
  )
}
