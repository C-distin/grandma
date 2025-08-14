import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { postSchema, type Post } from "@/lib/validation/PostSchema"

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const res = await fetch("/api/blog", { cache: "no-store" })

    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.statusText}`)
      return []
    }

    const data = await res.json()
    const PostsArraySchema = z.array(postSchema)
    const parsePosts = PostsArraySchema.safeParse(data)

    if (!parsePosts.success) {
      console.error("Failed to parse posts:", parsePosts.error)
      return []
    }

    const posts = parsePosts.data
    return posts.filter(post => post.status === "published")
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return []
  }
}

export default async function Page() {
  const posts = await getPublishedPosts()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12 mt-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-wide text-slate-800 md:text-5xl">Stories</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Welcome to my blog and stories, curated to bring you inspiration.
        </p>
      </section>

      {/* Blog Posts */}
      <section className="mx-auto max-w-6xl">
        {posts.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-slate-600">No stories yet, come back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-lg border border-slate-200 bg-white shadow transition-shadow duration-200 ease-in-out hover:shadow-lg"
              >
                {post.coverUrl && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.coverUrl}
                      alt={post.title}
                      width={400}
                      height={225}
                      className="h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="mb-2 text-xl font-semibold text-slate-800 transition-colors duration-200 group-hover:text-blue-600">
                    {post.title}
                  </h2>
                  <p className="mb-3 text-sm text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {post.content.replace(/<[^>]+>/g, "").slice(0, 120)}
                    {post.content.length > 120 ? "..." : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
