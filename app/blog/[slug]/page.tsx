"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { FaEye, FaHeart, FaClock, FaUser, FaCalendar, FaArrowLeft, FaShare, FaBookmark, FaTag } from "react-icons/fa6"
import type { BlogPost } from "@/lib/db/schema"
import { getBlogPosts } from "@/lib/actions/blog"
import { format } from "date-fns"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

interface NewsletterFormData {
  email: string
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const resolvedParams = await params
        const { slug } = resolvedParams

        // Find the specific post by slug
        const result = await getBlogPosts({
          page: 1,
          limit: 100,
          status: "published",
        })

        if (!result.success || !result.data) {
          throw new Error("Failed to load blog posts")
        }

        const foundPost = result.data.find(p => p.slug === slug)

        if (!foundPost) {
          notFound()
          return
        }

        setPost(foundPost)

        // Load related posts from the same category
        const related = result.data.filter(p => p.id !== foundPost.id && p.category === foundPost.category).slice(0, 3)

        setRelatedPosts(related)
      } catch (err) {
        console.error("Error loading post:", err)
        setError("Failed to load blog post")
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadBlogPost()
  }, [params])

  const handleShare = async () => {
    if (!post) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied!", {
          description: "Blog post link has been copied to your clipboard.",
        })
      }
    } catch (err) {
      console.error("Error sharing:", err)
      toast.error("Share failed", {
        description: "Unable to share the blog post. Please try again.",
      })
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newsletterEmail.trim()) {
      toast.error("Email required", {
        description: "Please enter your email address.",
      })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newsletterEmail)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address.",
      })
      return
    }

    try {
      setIsSubscribing(true)

      // TODO: Implement newsletter subscription logic
      // const response = await subscribeToNewsletter(newsletterEmail)

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success("Subscribed!", {
        description: "Thank you for subscribing to our newsletter.",
      })

      setNewsletterEmail("")
    } catch (err) {
      console.error("Newsletter subscription error:", err)
      toast.error("Subscription failed", {
        description: "Unable to subscribe. Please try again later.",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-64 bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded w-full"
                />
              ))}
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
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
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
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
            <div className="text-white text-center p-8 max-w-4xl">
              <Badge
                variant="secondary"
                className="mb-4"
              >
                {post.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">{post.excerpt}</p>
            </div>
          </div>

          {/* Article Meta */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
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
                    {post.views?.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHeart size={12} />
                    {post.likes?.toLocaleString()} likes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <FaShare size={14} />
                    <span className="sr-only">Share article</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <FaBookmark size={14} />
                    <span className="sr-only">Bookmark article</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8">
            <div className="prose prose-lg max-w-none prose-gray">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{post.content}</div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
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
                      className="hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
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
                  className="hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <span
                          className="text-lg"
                          role="img"
                          aria-label="Article"
                        >
                          📝
                        </span>
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
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
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
                        {relatedPost.views?.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Newsletter Subscription */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Enjoyed this article?</h3>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter for more insights and updates delivered straight to your inbox.
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white text-gray-900 placeholder:text-gray-500 border-0"
                  required
                  disabled={isSubscribing}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isSubscribing}
                  className="whitespace-nowrap"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
