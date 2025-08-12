"use client"

import React, { useState, useEffect } from "react"
import { FaXmark, FaFloppyDisk } from "react-icons/fa6"
import { toast } from "sonner"
import { createPost, updatePost } from "@/actions/blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { BlogPost } from "@/lib/validation/blog"
import { v4 as uuidv4 } from "uuid"
import { createClient } from "@supabase/supabase-js"
import Image from "next/image"

import { Tiptap } from "@/components/dashboard/Tiptap"

interface CreatePostProps {
  editingPost: BlogPost | null
  onSaved: () => void
  onCancel: () => void
}

type Status = "draft" | "published" | "archived"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function CreatePost({ editingPost, onSaved, onCancel }: CreatePostProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft" as Status,
    featuredImageFile: null as File | null,
    featuredImageUrl: "" as string,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title ?? "",
        slug: editingPost.slug ?? "",
        excerpt: editingPost.excerpt ?? "",
        content: editingPost.content ?? "",
        status: (editingPost.status as Status) ?? "draft",
        featuredImageFile: null,
        featuredImageUrl: editingPost.featuredImage ?? "",
      })
    } else {
      // reset when not editing
      setFormData(prev => ({
        ...prev,
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        status: "draft",
        featuredImageFile: null,
        featuredImageUrl: "",
      }))
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
    // Only auto-generate slug if user hasn't manually edited it (simple heuristic)
    setFormData(prev => {
      const shouldAuto = !prev.slug || prev.slug === generateSlug(prev.title)
      return {
        ...prev,
        title,
        slug: shouldAuto ? generateSlug(title) : prev.slug,
      }
    })
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!formData.featuredImageFile) return formData.featuredImageUrl || null

    try {
      const ext = formData.featuredImageFile.name.split(".").pop() ?? "jpg"
      const fileName = `${uuidv4()}.${ext}`
      const filePath = `posts/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, formData.featuredImageFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Supabase upload error:", uploadError)
        toast.error("Image upload failed")
        return null
      }

      const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath)
      return data.publicUrl
    } catch (err) {
      console.error("Upload error:", err)
      toast.error("Image upload failed")
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const imageUrl = await uploadImage()

      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featuredImage: imageUrl ? imageUrl : undefined,
        status: formData.status,
      }

      if (editingPost && editingPost.id) {
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
            disabled={loading}
          >
            <FaXmark
              className="mr-2"
              size={16}
            />
            Cancel
          </Button>
          <Button
            type="submit"
            form="post-form"
            disabled={loading}
          >
            <FaFloppyDisk
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
                  {/*
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your post content here..."
                    rows={15}
                    required
                  />
                  */}
                  <Tiptap
                    content={formData.content}
                    onUpdate={html => setFormData(prev => ({ ...prev, content: html }))}
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
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, status: value as Status }))}
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
                        featuredImageFile: e.target.files?.[0] ?? null,
                      }))
                    }
                  />

                  {/* Preview only when we have a URL */}
                  {formData.featuredImageUrl ? (
                    <div className="mt-2 w-full rounded-lg border overflow-hidden">
                      <Image
                        src={formData.featuredImageUrl}
                        alt="Current Featured"
                        width={800}
                        height={450}
                        style={{ width: "100%", height: "auto", objectFit: "cover" }}
                      />
                    </div>
                  ) : formData.featuredImageFile ? (
                    // preview local selected file
                    <div className="mt-2">
                      <Image
                        src={URL.createObjectURL(formData.featuredImageFile)}
                        alt="Selected preview"
                        width={800}
                        height={450}
                        style={{ width: "100%", height: "auto", objectFit: "cover" }}
                        className="w-full rounded-lg border"
                      />
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
