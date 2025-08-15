"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { toast } from "sonner"
import { BlogForm } from "@/components/dashboard/BlogForm"
import { BlogTable } from "@/components/dashboard/BlogTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { 
  FaPlus, 
  FaFilter, 
  FaEye, 
  FaHeart, 
  FaFileLines, 
  FaPenToSquare, 
  FaTrash,
  FaChartLine
} from "react-icons/fa6"
import { GlassesIcon as MagnifyingGlassIcon } from "lucide-react"
import type { BlogPost } from "@/types/blog"

type TabType = "overview" | "create" | "manage" | "analytics"
type FilterStatus = "all" | "draft" | "published" | "archived"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts()
  }, [])

  // Filter posts based on search and status
  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(post => post.status === statusFilter)
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, statusFilter])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/blog")
      if (!response.ok) throw new Error("Failed to fetch posts")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast.error("Failed to load blog posts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async (data: any) => {
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create post")
      
      await fetchPosts()
      setActiveTab("manage")
    } catch (error) {
      console.error("Error creating post:", error)
      throw error
    }
  }

  const handleUpdatePost = async (data: any) => {
    if (!editingPost) return

    try {
      const response = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPost.id, ...data }),
      })

      if (!response.ok) throw new Error("Failed to update post")
      
      await fetchPosts()
      setShowEditDialog(false)
      setEditingPost(null)
    } catch (error) {
      console.error("Error updating post:", error)
      throw error
    }
  }

  const handleDeletePost = async () => {
    if (!deletingPost) return

    try {
      const response = await fetch("/api/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingPost.id }),
      })

      if (!response.ok) throw new Error("Failed to delete post")
      
      await fetchPosts()
      setShowDeleteDialog(false)
      setDeletingPost(null)
      toast.success("Post deleted successfully")
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Failed to delete post")
    }
  }

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post)
    setShowEditDialog(true)
  }

  const openDeleteDialog = (post: BlogPost) => {
    setDeletingPost(post)
    setShowDeleteDialog(true)
  }

  const getStats = () => {
    const totalPosts = posts.length
    const publishedPosts = posts.filter(p => p.status === "published").length
    const draftPosts = posts.filter(p => p.status === "draft").length
    const archivedPosts = posts.filter(p => p.status === "archived").length

    return { totalPosts, publishedPosts, draftPosts, archivedPosts }
  }

  const stats = getStats()

  const tabs = [
    { id: "overview", label: "Overview", icon: FaChartLine },
    { id: "create", label: "Create Post", icon: FaPlus },
    { id: "manage", label: "Manage Posts", icon: FaFileLines },
    { id: "analytics", label: "Analytics", icon: FaEye },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Dashboard</h1>
          <p className="text-gray-600">Manage your blog posts, create new content, and track performance.</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Posts</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                      </div>
                      <FaFileLines className="text-blue-500" size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Published</p>
                        <p className="text-2xl font-bold text-green-600">{stats.publishedPosts}</p>
                      </div>
                      <FaEye className="text-green-500" size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Drafts</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.draftPosts}</p>
                      </div>
                      <FaPenToSquare className="text-yellow-500" size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Archived</p>
                        <p className="text-2xl font-bold text-gray-600">{stats.archivedPosts}</p>
                      </div>
                      <FaTrash className="text-gray-500" size={24} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading posts...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-8">
                      <FaFileLines className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600">No blog posts yet. Create your first post!</p>
                      <Button
                        onClick={() => setActiveTab("create")}
                        className="mt-4"
                      >
                        <FaPlus size={16} className="mr-2" />
                        Create Post
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.slice(0, 5).map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{post.title}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={post.status === "published" ? "default" : post.status === "draft" ? "secondary" : "outline"}>
                            {post.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "create" && (
            <BlogForm
              onSubmit={handleCreatePost}
              onCancel={() => setActiveTab("overview")}
            />
          )}

          {activeTab === "manage" && (
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input
                          placeholder="Search posts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFilter className="text-gray-400" size={16} />
                      <Select value={statusFilter} onValueChange={(value: FilterStatus) => setStatusFilter(value)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Posts ({filteredPosts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading posts...</p>
                    </div>
                  ) : (
                    <BlogTable
                      posts={filteredPosts}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FaChartLine className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">
                    Detailed analytics and insights about your blog performance will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <BlogForm
              initialData={editingPost}
              onSubmit={handleUpdatePost}
              onCancel={() => setShowEditDialog(false)}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingPost?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}