"use client"

import { motion } from "motion/react"
import { FaChartLine, FaGear, FaList, FaPlus } from "react-icons/fa6"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardLoading() {
  const tabs = [
    { id: "list", name: "All Posts", icon: FaList },
    { id: "create", name: "Create Post", icon: FaPlus },
    { id: "analytics", name: "Analytics", icon: FaChartLine },
    { id: "settings", name: "Settings", icon: FaGear },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-px bg-gray-300" />
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Navigation Tabs Skeleton */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab, index) => (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    index === 0 ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.name}
                </motion.div>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area - Default to Posts List Loading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PostsListSkeleton />
        </motion.div>
      </div>
    </div>
  )
}

function PostsListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header with Create Button Skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-44 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-44 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Posts List Skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-3/4 bg-gray-200 rounded" />
                      <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="h-8 w-8 bg-gray-200 rounded" />
                    <div className="h-8 w-8 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-5 w-20 bg-gray-200 rounded-full" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  <div className="h-5 w-24 bg-gray-200 rounded-full" />
                  <div className="h-5 w-18 bg-gray-200 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Alternative loading components for different tabs
export function CreatePostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-pulse">
            <div className="p-6 space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="space-y-4">
                <div>
                  <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
                  <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="h-4 w-12 bg-gray-200 rounded mb-2" />
                  <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-20 w-full bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-80 w-full bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <Card className="animate-pulse">
            <div className="p-6 space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="space-y-4">
                <div>
                  <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
                  <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
                  <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="animate-pulse">
            <div className="p-6 space-y-4">
              <div className="h-6 w-16 bg-gray-200 rounded" />
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-10 flex-1 bg-gray-200 rounded" />
                  <div className="h-10 w-16 bg-gray-200 rounded" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  <div className="h-6 w-18 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="animate-pulse"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Posts Skeleton */}
      <Card className="animate-pulse">
        <div className="p-6">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-4 w-48 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Category Form Skeleton */}
        <Card className="animate-pulse">
          <div className="p-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
            <div className="space-y-4">
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>
              <div>
                <div className="h-4 w-12 bg-gray-200 rounded mb-2" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-20 w-full bg-gray-200 rounded" />
              </div>
              <div>
                <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-10 bg-gray-200 rounded" />
                  <div className="flex-1 h-10 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
          </div>
        </Card>

        {/* Categories List Skeleton */}
        <Card className="animate-pulse">
          <div className="p-6">
            <div className="h-6 w-24 bg-gray-200 rounded mb-6" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-32 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded" />
                    <div className="h-8 w-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Archived Posts Skeleton */}
        <Card className="animate-pulse">
          <div className="p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="h-4 w-40 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                    <div className="h-3 w-12 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-20 bg-gray-200 rounded" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-6 w-6 bg-gray-200 rounded" />
                      <div className="h-6 w-6 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
