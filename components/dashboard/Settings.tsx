"use client"

import { formatDistanceToNow } from "date-fns"
import type React from "react"
import { useEffect, useState } from "react"
import { FaBoxArchive, FaEye, FaGear, FaPenToSquare, FaPlus, FaRotateLeft, FaTrash } from "react-icons/fa6"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createBlogCategory,
  deleteBlogCategory,
  deleteBlogPost,
  getBlogCategories,
  getBlogPosts,
  restoreBlogPost,
  updateBlogCategory,
} from "@/lib/actions/blog"
import type { BlogCategory, BlogPost } from "@/lib/db/schema"

export function Settings() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
  })

  const [archivedPosts, setArchivedPosts] = useState<BlogPost[]>([])
  const [loadingArchived, setLoadingArchived] = useState(true)

  useEffect(() => {
    loadCategories()
    loadArchivedPosts()
  }, [loadArchivedPosts, loadCategories])

  const loadCategories = async () => {
    try {
      const result = await getBlogCategories({ page: 1, limit: 100 })
      if (result.success && result.data) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadArchivedPosts = async () => {
    try {
      const result = await getBlogPosts({
        page: 1,
        limit: 100,
        status: "archived",
        sortBy: "updatedAt",
        sortOrder: "desc",
      })
      if (result.success && result.data) {
        setArchivedPosts(result.data)
      }
    } catch (error) {
      console.error("Error loading archived posts:", error)
    } finally {
      setLoadingArchived(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Category name is required")
      return
    }

    try {
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("slug", formData.slug)
      submitData.append("description", formData.description)
      submitData.append("color", formData.color)

      let result
      if (editingCategory) {
        result = await updateBlogCategory(editingCategory.id, submitData)
      } else {
        result = await createBlogCategory(submitData)
      }

      if (result.success) {
        toast.success(editingCategory ? "Category updated successfully" : "Category created successfully")
        setFormData({ name: "", slug: "", description: "", color: "#3B82F6" })
        setEditingCategory(null)
        loadCategories()
      } else {
        toast.error(result.error || "Failed to save category")
      }
    } catch (error) {
      console.error("Error saving category:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      color: category.color,
    })
  }

  const handleDelete = async (categoryId: string) => {
    try {
      const result = await deleteBlogCategory(categoryId)
      if (result.success) {
        toast.success("Category deleted successfully")
        loadCategories()
      } else {
        toast.error(result.error || "Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const handleDeleteArchivedPost = async (postId: string) => {
    try {
      const result = await deleteBlogPost(postId)
      if (result.success) {
        toast.success("Archived post deleted successfully")
        loadArchivedPosts()
      } else {
        toast.error(result.error || "Failed to delete archived post")
      }
    } catch (error) {
      console.error("Error deleting archived post:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const handleRestorePost = async (postId: string, status: "draft" | "published") => {
    try {
      const result = await restoreBlogPost(postId, status)
      if (result.success) {
        toast.success(`Post restored as ${status}`)
        loadArchivedPosts()
      } else {
        toast.error(result.error || "Failed to restore post")
      }
    } catch (error) {
      console.error("Error restoring post:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setFormData({ name: "", slug: "", description: "", color: "#3B82F6" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Settings</h2>
        <p className="text-gray-600">Manage your blog categories and preferences.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Category Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaGear size={20} />
              {editingCategory ? "Edit Category" : "Add New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Enter category name..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-slug"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the category..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                >
                  <FaPlus
                    className="mr-2"
                    size={16}
                  />
                  {editingCategory ? "Update Category" : "Add Category"}
                </Button>
                {editingCategory && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No categories yet. Create your first category!</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <FaPenToSquare size={14} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <FaTrash size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(category.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Archived Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaBoxArchive size={20} />
              Archived Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingArchived ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : archivedPosts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No archived posts yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {archivedPosts.map(post => (
                  <div
                    key={post.id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Archived {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <FaEye size={10} />
                          {post.views}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">{post.category}</span>
                        <span className="text-xs text-gray-500">{post.readingTime} min read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-transparent"
                            >
                              <FaRotateLeft size={10} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRestorePost(post.id, "draft")}>
                              Restore as Draft
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRestorePost(post.id, "published")}>
                              Restore as Published
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent h-6 w-6 p-0"
                            >
                              <FaTrash size={10} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Archived Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete "{post.title}"? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteArchivedPost(post.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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
