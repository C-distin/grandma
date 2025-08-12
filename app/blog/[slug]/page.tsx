"use client"

import { format } from "date-fns"
import { motion } from "motion/react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { FaArrowLeft, FaBookmark, FaCalendar, FaClock, FaEye, FaHeart, FaShare, FaUser } from "react-icons/fa6"
import { getPostBySlug, getPublishedPosts } from "@/actions/blog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { BlogPost } from "@/lib/validation/blog"

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
  }, [slug, loadPost])

  const loadPost = async () => {
    try {
      setLoading(true)

      const foundPost = await getPostBySlug(slug)
      if (!foundPost) {
        notFound()
        return
      }

      setPost(foundPost)

      // Load related posts (just get other published posts)
      const allPosts = await getPublishedPosts(10)
      const related = allPosts.filter(p => p.id !== foundPost.id).slice(0, 3)
      setRelatedPosts(related)
    } catch (error) {
      console.error("Error loading post:", error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

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
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white text-center p-8">
                <Badge
                  variant="secondary"
                  className="mb-4"
                >
                  {post.status}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                <p className="text-lg opacity-90 max-w-2xl">{post.excerpt}</p>
              </div>
            )}
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
                    {relatedPost.featuredImage ? (
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center mb-2 mx-auto">
                          <span className="text-lg">📝</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <Badge
                      variant="outline"
                      className="mb-2"
                    >
                      {relatedPost.status}
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
