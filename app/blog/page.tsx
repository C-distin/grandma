"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FaEye, FaHeart, FaClock, FaMagnifyingGlass, FaUser, FaCalendar } from "react-icons/fa6"
import type { BlogPost, BlogPostQuery } from "@/lib/db/schema"
import { getBlogPosts, getBlogCategories } from "@/lib/actions/blog"
import { formatDistanceToNow, format } from "date-fns"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState<BlogPostQuery>({
    page: 1,
    limit: 12,
    status: "published",
    sortBy: "publishedAt",
    sortOrder: "desc",
  })

  useEffect(() => {
    loadPosts()
    loadCategories()
  }, [query])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const result = await getBlogPosts(query)
      if (result.success) {
        setPosts(result.data || [])
      }
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const result = await getBlogCategories({ page: 1, limit: 100 })
      if (result.success && result.data) {
        setCategories(result.data.map((cat) => cat.name))
      }
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const featuredPost = posts[0]
  const regularPosts = posts.slice(1)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaMagnifyingGlass
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <Input
                      placeholder="Search articles..."
                      value={query.search || ""}
                      onChange={(e) => setQuery({ ...query, search: e.target.value || undefined, page: 1 })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={query.category || "all"}
                  onValueChange={(value) =>
                    setQuery({ ...query, category: value === "all" ? undefined : value, page: 1 })
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={`${query.sortBy}-${query.sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split("-")
                    setQuery({ ...query, sortBy: sortBy as any, sortOrder: sortOrder as any })
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publishedAt-desc">Latest First</SelectItem>
                    <SelectItem value="publishedAt-asc">Oldest First</SelectItem>
                    <SelectItem value="views-desc">Most Popular</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <FaMagnifyingGlass size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </motion.div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="aspect-video lg:aspect-square bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-center p-8">
                        <h3 className="text-2xl font-bold mb-2">Featured Article</h3>
                        <p className="opacity-90">Latest insights and updates</p>
                      </div>
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{featuredPost.category}</Badge>
                        <span className="text-sm text-gray-500">Featured</span>
                      </div>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                          {featuredPost.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <FaUser size={12} />
                            {featuredPost.authorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendar size={12} />
                            {featuredPost.publishedAt && format(new Date(featuredPost.publishedAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <FaEye size={12} />
                            {featuredPost.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaHeart size={12} />
                            {featuredPost.likes}
                          </span>
                        </div>
                      </div>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <Button className="w-full">Read Full Article</Button>
                      </Link>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow group">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                          <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mb-2 mx-auto">
                            <span className="text-2xl">📝</span>
                          </div>
                          <p className="text-sm">Article Image</p>
                        </div>
                      </div>
                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FaClock size={10} />
                            {post.readingTime} min read
                          </span>
                        </div>
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <FaUser size={12} />
                            {post.authorName}
                          </span>
                          <span>
                            {post.publishedAt && formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <FaEye size={12} />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaHeart size={12} />
                              {post.likes}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {posts.length >= query.limit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-12"
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setQuery({ ...query, limit: query.limit + 6 })}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More Articles"}
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

