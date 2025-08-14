import { notFound } from "next/navigation"
import Image from "next/image"
import { z } from "zod"
import { postSchema, type Post } from "@/lib/validation/PostSchema"

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`/api/blog/${slug}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`Failed to fetch post: ${res.status} ${res.statusText}`)
      return null
    }

    const data = await res.json()

    // Validate the response data
    const parseResult = postSchema.safeParse(data)

    if (!parseResult.success) {
      console.error("Invalid post data structure:", parseResult.error)
      return null
    }

    return parseResult.data
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogSlugPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return notFound()
  }

  // Only show published posts
  if (post.status !== "published") {
    return notFound()
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      {post.coverUrl && (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg shadow-lg md:h-96">
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">{post.title}</h1>
        <time
          dateTime={post.createdAt}
          className="text-sm text-slate-500"
        >
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      <article
        className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-a:text-blue-600 prose-strong:text-slate-800"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  )
}
