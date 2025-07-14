"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "motion/react"
import Image from "next/image"
import { FaFloppyDisk, FaEye, FaImage, FaTrash, FaPlus, FaXmark, FaMarkdown, FaCode } from "react-icons/fa6"
import type { CreatePostData } from "@/types/blog"
import { getBlogCategories } from "@/lib/actions/blog"
import type { BlogCategory } from "@/types/blog"

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(300, "Excerpt too long"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  status: z.enum(["draft", "published"]),
})

type CreatePostForm = z.infer<typeof createPostSchema>

interface CreatePostProps {
  editingPost?: BlogPost | null
  onSave: (data: CreatePostData) => void
  onCancel: () => void
}

export function CreatePost({ editingPost, onSave, onCancel }: CreatePostProps) {
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>("")
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])

  const featuredImageRef = useRef<HTMLInputElement>(null)
  const additionalImagesRef = useRef<HTMLInputElement>(null)

  // Load categories and populate form if editing
  useEffect(() => {
    const loadData = async () => {
      const categoriesResult = await getBlogCategories()
      if (categoriesResult.success) {
        setCategories(categoriesResult.categories)
      }

      if (editingPost) {
        setValue("title", editingPost.title)
        setValue("excerpt", editingPost.excerpt)
        setValue("content", editingPost.content)
        setValue("category", editingPost.category)
        setValue("tags", editingPost.tags)
        setValue("status", editingPost.status as "draft" | "published")

        if (editingPost.featuredImage) {
          setFeaturedImagePreview(editingPost.featuredImage)
        }
      }
    }

    loadData()
  }, [editingPost, setValue])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      status: "draft",
      tags: [],
    },
  })

  const watchedContent = watch("content", "")
  const watchedTags = watch("tags", [])

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFeaturedImage(file)
      const reader = new FileReader()
      reader.onload = e => setFeaturedImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAdditionalImages(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        setAdditionalImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index))
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      const newTags = [...watchedTags, tagInput.trim()]
      setValue("tags", newTags)
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = watchedTags.filter(tag => tag !== tagToRemove)
    setValue("tags", newTags)
  }

  const onSubmit = (data: CreatePostForm) => {
    const postData: CreatePostData = {
      ...data,
      featuredImage: featuredImage || undefined,
      images: additionalImages.length > 0 ? additionalImages : undefined,
    }
    onSave(postData)
  }

  const renderMarkdownPreview = (content: string) => {
    // Simple markdown preview (in a real app, use a proper markdown parser)
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, "<br>")
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
            <p className="text-gray-600 mt-1">
              {editingPost ? "Edit your blog post" : "Write and publish your blog post"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isPreviewMode ? <FaCode size={16} /> : <FaEye size={16} />}
              {isPreviewMode ? "Edit" : "Preview"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Title *</label>
              <input
                {...register("title")}
                type="text"
                placeholder="Enter your post title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* Content Editor */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Content * {isPreviewMode && "(Preview)"}</label>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaMarkdown size={14} />
                  Markdown supported
                </div>
              </div>

              {isPreviewMode ? (
                <div
                  className="min-h-[400px] p-4 border border-gray-200 rounded-lg prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: `<p class="mb-4">${renderMarkdownPreview(watchedContent)}</p>`,
                  }}
                />
              ) : (
                <textarea
                  {...register("content")}
                  rows={20}
                  placeholder="Write your post content here... You can use Markdown formatting."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                />
              )}
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
            </div>

            {/* Excerpt */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
              <textarea
                {...register("excerpt")}
                rows={3}
                placeholder="Brief description of your post..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publish Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    {...register("status")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    {...register("category")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option
                        key={category.id}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags *</h3>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyPress={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {watchedTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-600"
                      >
                        <FaXmark size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                {errors.tags && <p className="text-sm text-red-600">{errors.tags.message}</p>}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>

              {featuredImagePreview ? (
                <div className="space-y-3">
                  <Image
                    src={featuredImagePreview}
                    alt="Featured image preview"
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage(null)
                      setFeaturedImagePreview("")
                      if (featuredImageRef.current) featuredImageRef.current.value = ""
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
                  >
                    <FaTrash size={12} />
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    ref={featuredImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => featuredImageRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <FaImage
                      className="text-gray-400"
                      size={20}
                    />
                    <span className="text-gray-600">Upload Featured Image</span>
                  </button>
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Images</h3>

              <div className="space-y-3">
                {additionalImagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative"
                  >
                    <Image
                      src={preview}
                      alt={`Additional image ${index + 1}`}
                      width={300}
                      height={150}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <FaXmark size={12} />
                    </button>
                  </div>
                ))}

                <div>
                  <input
                    ref={additionalImagesRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => additionalImagesRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <FaPlus size={14} />
                    Add Images
                  </button>
                </div>
              </div>
            </div>

            {/* Save Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="space-y-3">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  <FaFloppyDisk size={16} />
                  {isSubmitting ? "Saving..." : editingPost ? "Update Post" : "Save Post"}
                </motion.button>

                <button
                  type="button"
                  onClick={() => setValue("status", "draft")}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
