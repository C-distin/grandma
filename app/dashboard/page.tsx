"use client"

import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { FaArrowLeft, FaChartLine, FaGear, FaImage, FaList, FaPlus } from "react-icons/fa6"
import { toast } from "sonner"
import { CreatePost } from "@/components/dashboard/CreatePost"
import { PostList } from "@/components/dashboard/PostList"
import { getFeaturedPosts, deletePost } from "@/actions/blog"

type TabType = "list" | "create" | "gallery" | "analytics" | "settings"
type PostType = Awaited<ReturnType<typeof getFeaturedPosts>>[number]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("list")
  const [posts, setPosts] = useState<PostType[]>([])
  const [editingPost, setEditingPost] = useState<PostType | null>(null)

  // Fetch posts on mount
  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    const data = await getFeaturedPosts(50)
    setPosts(data)
  }

  function handleCreateNew() {
    setEditingPost(null)
    setActiveTab("create")
  }

  function handleEditPost(post: PostType) {
    setEditingPost(post)
    setActiveTab("create")
  }

  async function handleDeletePost(id: string) {
    await deletePost(id)
    toast.success("Post deleted")
    loadPosts()
  }

  async function handlePostSaved() {
    toast.success("Post saved successfully")
    setActiveTab("list")
    loadPosts()
  }

  function handleCancelEdit() {
    setActiveTab("list")
    setEditingPost(null)
  }

  const tabs = [
    { id: "list" as TabType, name: "All Posts", icon: FaList },
    { id: "create" as TabType, name: "Create Post", icon: FaPlus },
    { id: "gallery" as TabType, name: "Gallery", icon: FaImage },
    { id: "analytics" as TabType, name: "Analytics", icon: FaChartLine },
    { id: "settings" as TabType, name: "Settings", icon: FaGear },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "list":
        return (
          <PostList
            posts={posts}
            onCreateNew={handleCreateNew}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        )
      case "create":
        return (
          <CreatePost
            editingPost={editingPost}
            onSaved={handlePostSaved}
            onCancel={handleCancelEdit}
          />
        )
      case "settings":
        return <Settings />
      case "gallery":
        return <ImageUpload />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              onClick={() => window.history.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft size={16} />
              Back
            </motion.button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-3xl font-bold text-gray-900">Blog Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage your blog posts, create new content, and track performance.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    <tab.icon size={16} />
                    {tab.name}
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}
