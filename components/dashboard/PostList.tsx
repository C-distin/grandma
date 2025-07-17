"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import {
  FaEye,
  FaHeart,
  FaClock,
  FaPenToSquare,
  FaTrash,
  FaMagnifyingGlass,
  FaFilter,
  FaSort,
  FaPlus,
  FaCalendar,
} from "react-icons/fa6"
import { BlogPost, PostFilters } from "@/types/blog"
import { getBlogPosts, getBlogCategories, deleteBlogPost } from "@/lib/actions/blog"
import { BlogCategory } from "@/types/blog"
import { toast } from "sonner"

interface PostListProps {
  onCreateNew: () => void
  onEditPost: (post: BlogPost) => void
}

export function PostList({ onCreateNew, onEditPost }: PostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<PostFilters>({
    status: "all",
    sortBy: "newest",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsResult, categoriesResult] = await Promise.all([
          getBlogPosts(),
          getBlogCategories()
        ])

        if (postsResult.success) {
          setPosts(postsResult.posts)
        } else {
          console.error("Failed to load posts:", postsResult.error)
          toast.error("Failed to load blog posts")
        }

        if (categoriesResult.success) {
          setCategories(categoriesResult.categories)
        } else {
          console.error("Failed to load categories:", categoriesResult.error)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        toast.error("Failed to load blog data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredPosts = posts
    .filter(post => {
      if (filters.status !== "all" && post.status !== filters.status) return false
      if (filters.category && post.category !== filters.category) return false
      if (
        searchTerm &&
        !post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false
      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "views":
          return b.views - a.views
        default: // newest
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      const result = await deleteBlogPost(postId)
      if (result.success) {
        setPosts(posts.filter(post => post.id !== postId))
        toast.success("Post deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === "published").length,
    drafts: posts.filter(p => p.status === "draft").length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FaPenToSquare
              className="text-blue-500"
              size={24}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <FaCalendar
              className="text-green-500"
              size={24}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.drafts}</p>
            </div>
            <FaClock
              className="text-yellow-500"
              size={24}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
            </div>
            <FaEye
              className="text-purple-500"
              size={24}
            />
          </div>
        </div>
      </div>

      {/* Header with Search and Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FaMagnifyingGlass
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaFilter size={16} />
              Filters
            </button>

            <motion.button
              onClick={onCreateNew}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaPlus size={16} />
              New Post
            </motion.button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status-filter"
                    value={filters.status}
                    onChange={e => setFilters({ ...filters, status: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="category-filter"
                    value={filters.category || ""}
                    onChange={e => setFilters({ ...filters, category: e.target.value || undefined })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option
                        key={category.id}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sortby-filter" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    id="sortby-filter"
                    value={filters.sortBy}
                    onChange={e => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                    <option value="views">Most Views</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <FaPenToSquare
              className="mx-auto text-gray-400 mb-4"
              size={48}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filters.status !== "all" || filters.category
                ? "Try adjusting your filters or search terms."
                : "Get started by creating your first blog post."}
            </p>
            <button
              type="button"
              onClick={onCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Create New Post
            </button>
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex gap-6">
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="flex-shrink-0">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      width={120}
                      height={80}
                      className="w-30 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendar size={12} />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock size={12} />
                      {post.readingTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <FaEye size={12} />
                      {post.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart size={12} />
                      {post.likes}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditPost(post)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FaPenToSquare size={12} />
                      Edit
                    </button>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FaEye size={12} />
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FaTrash size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

