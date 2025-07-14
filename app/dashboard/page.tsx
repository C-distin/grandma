'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { 
  FaList, 
  FaPlus, 
  FaChartLine, 
  FaCog,
  FaArrowLeft
} from 'react-icons/fa6'
import { PostList } from '@/components/dashboard/PostList'
import { CreatePost } from '@/components/dashboard/CreatePost'
import { BlogPost, CreatePostData } from '@/types/blog'
import { createBlogPost, updateBlogPost } from '@/lib/actions/blog'
import { toast } from 'sonner'

type TabType = 'list' | 'create' | 'analytics' | 'settings'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('list')
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

  const tabs = [
    { id: 'list' as TabType, name: 'All Posts', icon: FaList },
    { id: 'create' as TabType, name: 'Create Post', icon: FaPlus },
    { id: 'analytics' as TabType, name: 'Analytics', icon: FaChartLine },
    { id: 'settings' as TabType, name: 'Settings', icon: FaCog },
  ]

  const handleCreatePost = () => {
    setEditingPost(null)
    setActiveTab('create')
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setActiveTab('create')
  }

  const handleSavePost = async (data: CreatePostData) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('excerpt', data.excerpt)
      formData.append('content', data.content)
      formData.append('category', data.category)
      formData.append('tags', JSON.stringify(data.tags))
      formData.append('status', data.status)
      if (data.featuredImage) {
        formData.append('featuredImage', data.featuredImage)
      }

      let result
      if (editingPost) {
        result = await updateBlogPost(editingPost.id, formData)
      } else {
        result = await createBlogPost(formData)
      }

      if (result.success) {
        toast.success(editingPost ? 'Post updated successfully!' : 'Post created successfully!')
        setActiveTab('list')
        setEditingPost(null)
      } else {
        toast.error(result.error || 'Failed to save post')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const handleCancelEdit = () => {
    setActiveTab('list')
    setEditingPost(null)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'list':
        return (
          <PostList 
            onCreateNew={handleCreatePost}
            onEditPost={handleEditPost}
          />
        )
      case 'create':
        return (
          <CreatePost 
            editingPost={editingPost}
            onSave={handleSavePost}
            onCancel={handleCancelEdit}
          />
        )
      case 'analytics':
        return (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <FaChartLine className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-600">
              Track your blog performance, reader engagement, and post analytics.
            </p>
          </div>
        )
      case 'settings':
        return (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <FaCog className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
            <p className="text-gray-600">
              Configure your blog settings, categories, and preferences.
            </p>
          </div>
        )
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
          <p className="text-gray-600">
            Manage your blog posts, create new content, and track performance.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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