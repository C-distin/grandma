"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Tiptap } from "@/components/dashboard/Tiptap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlogPost } from "@/types/blog"

const blogFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must not exceed 255 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
})

type BlogFormData = z.infer<typeof blogFormSchema>

interface BlogFormProps {
  initialData?: Partial<BlogPost>
  onSubmit: (data: BlogFormData) => Promise<void>
  onCancel?: () => void
  isEditing?: boolean
}

export function BlogForm({ initialData, onSubmit, onCancel, isEditing = false }: BlogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      coverUrl: initialData?.coverUrl || "",
      status: initialData?.status || "draft",
    },
  })

  const watchedContent = watch("content")
  const watchedStatus = watch("status")

  const handleFormSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      if (!isEditing) {
        reset()
        toast.success("Blog post created successfully!")
      } else {
        toast.success("Blog post updated successfully!")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to save blog post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContentUpdate = (html: string) => {
    setValue("content", html, { shouldValidate: true })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your blog post title..."
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Cover Image URL Field */}
          <div className="space-y-2">
            <Label htmlFor="coverUrl">Cover Image URL (Optional)</Label>
            <Input
              id="coverUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("coverUrl")}
              className={errors.coverUrl ? "border-red-500" : ""}
            />
            {errors.coverUrl && (
              <p className="text-sm text-red-600">{errors.coverUrl.message}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={watchedStatus}
              onValueChange={(value: "draft" | "published" | "archived") => 
                setValue("status", value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label>Content</Label>
            <Tiptap
              content={watchedContent || ""}
              onUpdate={handleContentUpdate}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </div>
              ) : (
                isEditing ? "Update Post" : "Create Post"
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}

            {!isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Clear Form
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}