"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FaEye, FaHeart, FaClock, FaUser, FaCalendar, FaArrowLeft, FaShare, FaBookmark, FaTag } from "react-icons/fa6"
import type { BlogPost } from "@/lib/db/schema"
import { getBlogPosts } from "@/lib/actions/blog"
import { format } from "date-fns"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>("")

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)

      // Find the specific post by slug
      {/* const result = await getBlogPosts({
        page: 1,
        limit: 100,
        status: "published",
      })

      if (result.success && result.data) {
        const foundPost = result.data.find(p => p.slug === slug)

        if (!foundPost) {
          notFound()
          return
        }

        setPost(foundPost) 

      // Load related posts from the same category
      const related = result.data.filter(p => p.id !== foundPost.id && p.category === foundPost.category).slice(0, 3)

      setRelatedPosts(related)
    }
  }
  catch (error)
  {
    console.error("Error loading post:", error)
    notFound()
  }
  finally
  {
    setLoading(false)
  }
} */}

      const handleShare = async () => {
        if (navigator.share && post) {
          try {
            await navigator.share({
              title: post.title,
              text: post.excerpt,
              url: window.location.href,
            })
          } catch (error) {
            console.log("Error sharing:", error)
          }
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(window.location.href)
          // You could show a toast here
        }
      }

      if (loading) {
        return (
          <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (!post) {
        notFound()
      }

      return (
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft size={16} />
                Back to Blog
              </Link>
            </motion.div>

            {/* Article Header */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Hero Section */}
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <Badge
                    variant="secondary"
                    className="mb-4"
                  >
                    {post.category}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                  <p className="text-lg opacity-90 max-w-2xl">{post.excerpt}</p>
                </div>
              </div>

              {/* Article Meta */}
              <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaUser
                        className="text-gray-600"
                        size={20}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{post.authorName}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendar size={12} />
                          {post.publishedAt && format(new Date(post.publishedAt), "MMMM dd, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock size={12} />
                          {post.readingTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaEye size={12} />
                        {post.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <FaHeart size={12} />
                        {post.likes} likes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                      >
                        <FaShare size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <FaBookmark size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 md:p-8">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{post.content}</div>
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <FaTag
                      className="text-gray-400"
                      size={16}
                    />
                    <span className="text-sm font-medium text-gray-700">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(relatedPost => (
                    <Card
                      key={relatedPost.id}
                      className="hover:shadow-lg transition-shadow group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                          <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center mb-2 mx-auto">
                            <span className="text-lg">📝</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <Badge
                          variant="outline"
                          className="mb-2"
                        >
                          {relatedPost.category}
                        </Badge>
                        <Link href={`/blog/${relatedPost.slug}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{relatedPost.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaClock size={10} />
                            {relatedPost.readingTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <FaEye size={10} />
                            {relatedPost.views}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Enjoyed this article?</h3>
                  <p className="text-lg opacity-90 mb-6">Subscribe to our newsletter for more insights and updates.</p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 rounded-lg text-gray-900"
                    />
                    <Button variant="secondary">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )
    }
