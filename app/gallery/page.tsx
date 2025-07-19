"use client"

import { motion } from "motion/react"
import { ImageGallery } from "@/components/gallery/ImageGallery"

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Image Gallery</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of beautiful images. Search, filter, and download high-quality photos for your
            projects.
          </p>
        </motion.div>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ImageGallery />
        </motion.div>
      </div>
    </div>
  )
}
