"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FaSave, FaTimes } from "react-icons/fa"
import { toast } from "sonner"
import { Tiptap } from "@/components/dashboard/Tiptap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { BlogPost } from "@/lib/validation/blog"
import { blogPostSchema } from "@/lib/validation/blog"
import { createPost, updatePost } from "@/actions/blog"

interface CreatePostProps {
  editingPost: BlogPost | null
  onSaved: () => void
  onCancel: () => void
}

type Status = "draft" | "published" | "archived"

export function CreatePost({ editingPost, onSaved, onCancel }: CreatePostProps) {
  // keep the form resolver in case you wire validation later
  const _form = useForm<BlogPost>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      status: "draft",
    },
  })

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft" as Status,
    featuredImage: null as File | null,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        slug: editingPost.slug,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        status: editingPost.status as Status,
        featuredImage: null,
      })
    }
  }, [editingPost])

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      // NOTE: URL.createObjectURL produces a temporary blob URL.
      // If you want permanent storage, you should upload to storage (Supabase, S3, etc.)
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featuredImage: formData.featuredImage ? URL.createObjectURL(formData.featuredImage) : undefined,
        status: formData.status,
      }

      if (editingPost) {
        await updatePost(editingPost.id, payload)
      } else {
        await createPost(payload)
      }

      toast.success("Post saved successfully!")
      onSaved()
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
          {/* Save as submit button — form's onSubmit handles it */}
          <Button
            type="submit"
            form="post-form"
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
        id="post-form"
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
                  <Tiptap
                    content={formData.content}
                    onChange={content => setFormData(prev => ({ ...prev, content }))}
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
                    onValueChange={(value: Status) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="featuredImage">Featured Image</Label>
                  <Input
                    id="featuredImage"
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData(prev => ({
                        ...prev,
                        featuredImage: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
