"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FaSave, FaTimes, FaTag } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/db/schema"
import { createBlogPost, updateBlogPost, getBlogCategories } from "@/lib/actions/blog"
import { toast } from "sonner"

interface CreatePostProps {
  editingPost: BlogPost | null
  onSaved: () => void
  onCancel: () => void
}

export function CreatePost({ editingPost, onSaved, onCancel }: CreatePostProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published" | "archived",
    featuredImage: null as File | null,
  })
  const [tagInput, setTagInput] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        slug: editingPost.slug,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        category: editingPost.category,
        tags: editingPost.tags,
        status: editingPost.status as any,
        featuredImage: null,
      })
    }
  }, [editingPost])

  const loadCategories = async () => {
    try {
      const result = await getBlogCategories({ page: 1, limit: 100 })
      if (result.success && result.data) {
        setCategories(result.data.map(cat => cat.name))
      }
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.tags.length === 0) {
      toast.error("Please add at least one tag")
      return
    }

    setLoading(true)
    try {
      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("slug", formData.slug)
      submitData.append("excerpt", formData.excerpt)
      submitData.append("content", formData.content)
      submitData.append("category", formData.category)
      submitData.append("tags", JSON.stringify(formData.tags))
      submitData.append("status", formData.status)

      if (formData.featuredImage) {
        submitData.append("featuredImage", formData.featuredImage)
      }

      let result
      if (editingPost) {
        result = await updateBlogPost(editingPost.id, submitData)
      } else {
        result = await createBlogPost(submitData)
      }

      if (result.success) {
        onSaved()
      } else {
        toast.error(result.error || "Failed to save post")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{editingPost ? "Edit Post" : "Create New Post"}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            <FaTimes
              className="mr-2"
              size={16}
            />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            <FaSave
              className="mr-2"
              size={16}
            />
            {loading ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="Enter post title..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="post-slug"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of your post..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your post content here..."
                    rows={15}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem
                          key={category}
                          value={category}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="featuredImage">Featured Image</Label>
                  <Input
                    id="featuredImage"
                    type="file"
                    accept="image/*"
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        featuredImage: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaTag size={16} />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
