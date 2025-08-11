"use client"

import { formatDistanceToNow } from "date-fns"
import { motion } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FaCalendar, FaDownload, FaExpand, FaEye, FaMagnifyingGlass } from "react-icons/fa6"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getGalleryImages } from "@/lib/actions/gallery"
import type { GalleryImage, GalleryImageQuery } from "@/lib/db/schema"

export function ImageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadImages()
  }, [loadImages])

  const loadImages = async () => {
    try {
      setLoading(true)
      const query: GalleryImageQuery = {
        page: 1,
        limit: 50,
        sortBy: "uploadedAt",
        sortOrder: "desc",
      }

      const result = await getGalleryImages(query)
      if (result.success && result.data) {
        setImages(result.data)
        setFilteredImages(result.data)
      }
    } catch (error) {
      console.error("Error loading images:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = images

    if (searchQuery) {
      filtered = filtered.filter(
        image =>
          image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(image => image.tags?.includes(selectedTag))
    }

    setFilteredImages(filtered)
  }, [images, searchQuery, selectedTag])

  const allTags = Array.from(new Set(images.flatMap(image => image.tags || [])))

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  // Bento grid layout helper
  const getBentoClass = (index: number) => {
    const patterns = [
      "md:col-span-2 md:row-span-2", // Large
      "md:col-span-1 md:row-span-1", // Small
      "md:col-span-1 md:row-span-2", // Tall
      "md:col-span-2 md:row-span-1", // Wide
      "md:col-span-1 md:row-span-1", // Small
      "md:col-span-1 md:row-span-1", // Small
    ]
    return patterns[index % patterns.length]
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        {[...Array(8)].map((_, i) => (
          <Card
            key={i}
            className={`animate-pulse ${getBentoClass(i)}`}
          >
            <div className="h-full bg-gray-200 rounded-lg"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaMagnifyingGlass
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Button>
              {allTags.slice(0, 6).map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bento Grid Gallery */}
      {filteredImages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FaEye
              className="mx-auto text-gray-400 mb-4"
              size={48}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-600">Try adjusting your search or upload some images to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={getBentoClass(index)}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                <div className="relative h-full">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.title || image.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{image.title || image.name}</h3>
                    {image.description && <p className="text-xs opacity-90 line-clamp-2 mb-2">{image.description}</p>}
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <FaCalendar size={10} />
                        {formatDistanceToNow(new Date(image.uploadedAt), { addSuffix: true })}
                      </span>
                      <span>{formatFileSize(image.size)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <FaExpand size={12} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{image.title || image.name}</DialogTitle>
                          <DialogDescription>{image.description}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={image.title || image.name}
                            className="w-full max-h-96 object-contain rounded-lg"
                          />
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Dimensions:</span>
                              <br />
                              {image.width && image.height ? `${image.width} × ${image.height}` : "Unknown"}
                            </div>
                            <div>
                              <span className="font-medium">Size:</span>
                              <br />
                              {formatFileSize(image.size)}
                            </div>
                            <div>
                              <span className="font-medium">Uploaded:</span>
                              <br />
                              {formatDistanceToNow(new Date(image.uploadedAt), { addSuffix: true })}
                            </div>
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadImage(image.url, image.name)}
                                className="w-full"
                              >
                                <FaDownload
                                  size={12}
                                  className="mr-2"
                                />
                                Download
                              </Button>
                            </div>
                          </div>
                          {image.tags && image.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {image.tags.map(tag => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => downloadImage(image.url, image.name)}
                    >
                      <FaDownload size={12} />
                    </Button>
                  </div>

                  {/* Tags Badge */}
                  {image.tags && image.tags.length > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        {image.tags[0]}
                        {image.tags.length > 1 && ` +${image.tags.length - 1}`}
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
