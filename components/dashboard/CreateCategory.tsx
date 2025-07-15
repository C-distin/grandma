"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "motion/react"
import { FaFloppyDisk, FaPalette, FaTag } from "react-icons/fa6"
import type { BlogCategory } from "@/types/blog"

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
})

type CreateCategoryForm = z.infer<typeof createCategorySchema>

interface CreateCategoryData {
  name: string
  description?: string
  color: string
}

interface CreateCategoryProps {
  editingCategory?: BlogCategory | null
  onSave: (data: CreateCategoryData) => void
  onCancel: () => void
}

const predefinedColors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#8B5CF6", // Purple
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6366F1", // Indigo
]

export function CreateCategory({ editingCategory, onSave, onCancel }: CreateCategoryProps) {
  const [selectedColor, setSelectedColor] = useState("#3B82F6")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateCategoryForm>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      color: "#3B82F6",
    },
  })

  const watchedColor = watch("color", "#3B82F6")

  // Populate form if editing
  useEffect(() => {
    if (editingCategory) {
      setValue("name", editingCategory.name)
      setValue("description", editingCategory.description || "")
      setValue("color", editingCategory.color)
      setSelectedColor(editingCategory.color)
    }
  }, [editingCategory, setValue])

  // Update form when color changes
  useEffect(() => {
    setValue("color", selectedColor)
  }, [selectedColor, setValue])

  const onSubmit = (data: CreateCategoryForm) => {
    onSave({
      name: data.name,
      description: data.description || undefined,
      color: data.color,
    })
  }

  const generateSlugPreview = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaTag className="text-blue-600" />
            {editingCategory ? "Edit Category" : "Create New Category"}
          </h2>
          <p className="text-gray-600 mt-2">
            {editingCategory ? "Update your blog category" : "Create a new category for organizing your blog posts"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter category name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            
            {/* Slug Preview */}
            {watch("name") && (
              <div className="mt-2 text-sm text-gray-500">
                Slug: <code className="bg-gray-100 px-2 py-1 rounded">{generateSlugPreview(watch("name"))}</code>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Optional description for this category..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Category Color *
            </label>
            
            {/* Predefined Colors */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Choose from predefined colors:</p>
              <div className="grid grid-cols-5 gap-3">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      selectedColor === color
                        ? "border-gray-400 scale-110 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Select ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Input */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Or choose a custom color:</p>
              <div className="flex items-center gap-3">
                <input
                  {...register("color")}
                  type="color"
                  value={watchedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={watchedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
              {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>}
            </div>

            {/* Color Preview */}
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: watchedColor }}
                />
                <span
                  className="px-3 py-1 text-sm font-medium rounded-full"
                  style={{
                    backgroundColor: watchedColor + "20",
                    color: watchedColor,
                  }}
                >
                  {watch("name") || "Category Name"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FaFloppyDisk size={16} />
              {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
            </motion.button>

            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}