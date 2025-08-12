"use client"

import { format } from "date-fns"
import { motion } from "motion/react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FaClock, FaEye, FaHeart, FaUser } from "react-icons/fa6"
import { getPublishedPosts } from "@/actions/blog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { BlogPost } from "@/lib/validation/blog"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  async function loadPosts() {
    try {
      setLoading(true)
      const data = await getPublishedPosts()
      setPosts(data)
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Our Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover insights, tutorials, and stories from our team. Stay updated with the latest trends and best
            practices.
          </motion.p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts published yet</h3>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow group h-full">
                  {/* Featured Image */}
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        width={400}
                        height={400}
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center mb-2 mx-auto">
                          <span className="text-lg">📝</span>
                        </div>
                        <span className="text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{post.status}</Badge>
                      <span className="text-xs text-gray-500">
                        {post.publishedAt && format(new Date(post.publishedAt), "MMM dd, yyyy")}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{post.excerpt}</p>

                    {/* Author and Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <FaUser size={12} />
                        <span>{post.authorName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FaClock size={10} />
                          {post.readingTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEye size={10} />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaHeart size={10} />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
