"use client"

import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { FaCalendar, FaMagnifyingGlass, FaPenToSquare, FaPlus, FaTag, FaTrash } from "react-icons/fa6"
import { toast } from "sonner"
import { deleteBlogCategory } from "@/lib/actions/categories"
import type { BlogCategory } from "@/types/blog"

interface CategoryListProps {
  onCreateNew: () => void
  onEditCategory: (category: BlogCategory) => void
}

export function CategoryList({ onCreateNew, onEditCategory }: CategoryListProps) {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "created">("name")

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getBlogCategories({ sortBy })
        if (result.success) {
          setCategories(result.categories)
        } else {
          console.error("Failed to load categories:", result.error)
          toast.error(result.error || "Failed to load categories")
        }
      } catch (error) {
        console.error("Error loading categories:", error)
        toast.error("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [sortBy])

  const filteredCategories = categories.filter(
    category => !searchTerm || category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    try {
      const result = await deleteBlogCategory(categoryId)
      if (result.success) {
        setCategories(categories.filter(category => category.id !== categoryId))
        toast.success("Category deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Categories</p>
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
          </div>
          <FaTag
            className="text-blue-500"
            size={24}
          />
        </div>
      </div>

      {/* Header with Search and Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FaMagnifyingGlass
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as "name" | "created")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <option value="name">Sort by Name</option>
              <option value="created">Sort by Date</option>
            </select>

            <motion.button
              onClick={onCreateNew}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaPlus size={16} />
              New Category
            </motion.button>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <FaTag
              className="mx-auto text-gray-400 mb-4"
              size={48}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first blog category."}
            </p>
            <button
              type="button"
              onClick={onCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Create New Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditCategory(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit category"
                    >
                      <FaPenToSquare size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                {category.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaCalendar size={10} />
                    {formatDate(category.createdAt)}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{category.slug}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
