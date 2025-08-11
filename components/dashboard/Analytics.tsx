"use client"

import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { FaArchive } from "react-icons/fa"
import { FaArrowDown, FaArrowUp, FaCalendar, FaChartLine, FaEye, FaFile, FaHeart } from "react-icons/fa6"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBlogPosts } from "@/lib/actions/blog"
import type { BlogPost } from "@/lib/db/schema"

export function Analytics() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [archivedPosts, setArchivedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  const loadAnalytics = async () => {
    try {
      const result = await getBlogPosts({ page: 1, limit: 100 })
      if (result.success && result.data) {
        setPosts(result.data)
      }

      // Load archived posts separately for detailed analytics
      const archivedResult = await getBlogPosts({
        page: 1,
        limit: 100,
        status: "archived",
        sortBy: "updatedAt",
        sortOrder: "desc",
      })
      if (archivedResult.success && archivedResult.data) {
        setArchivedPosts(archivedResult.data)
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
  const publishedPosts = posts.filter(post => post.status === "published").length
  const draftPosts = posts.filter(post => post.status === "draft").length
  const archivedPostsCount = posts.filter(post => post.status === "archived").length

  // Archived posts specific metrics
  const archivedViews = archivedPosts.reduce((sum, post) => sum + post.views, 0)
  const archivedLikes = archivedPosts.reduce((sum, post) => sum + post.likes, 0)
  const avgViewsPerArchivedPost = archivedPosts.length > 0 ? Math.round(archivedViews / archivedPosts.length) : 0

  const topPosts = posts
    .filter(post => post.status === "published")
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <Card
            key={i}
            className="animate-pulse"
          >
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Overview</h2>
        <p className="text-gray-600">Track your blog performance and engagement metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaEye
                  className="text-blue-600"
                  size={20}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{totalLikes.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FaHeart
                  className="text-red-600"
                  size={20}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published Posts</p>
                <p className="text-2xl font-bold text-gray-900">{publishedPosts}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaFile
                  className="text-green-600"
                  size={20}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Posts</p>
                <p className="text-2xl font-bold text-gray-900">{draftPosts}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaChartLine
                  className="text-yellow-600"
                  size={20}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Archived Posts</p>
                <p className="text-2xl font-bold text-gray-900">{archivedPostsCount}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <FaArchive
                  className="text-gray-600"
                  size={20}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaArrowUp size={20} />
            Top Performing Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No published posts yet.</p>
          ) : (
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{post.title}</h4>
                      <p className="text-sm text-gray-600">{post.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaEye size={12} />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart size={12} />
                      {post.likes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Archived Posts Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaArchive size={20} />
              Archived Posts Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {archivedPosts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No archived posts yet.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{archivedPosts.length}</div>
                    <div className="text-sm text-gray-600">Total Archived</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{archivedViews.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Views</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{archivedLikes.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Likes</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{avgViewsPerArchivedPost}</div>
                    <div className="text-sm text-gray-600">Avg Views/Post</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaArrowDown size={20} />
              Recently Archived Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {archivedPosts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No archived posts yet.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {archivedPosts.slice(0, 5).map(post => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FaCalendar size={10} />
                          {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                        </span>
                        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{post.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
