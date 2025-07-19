"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FaUpload, FaImage, FaX } from "react-icons/fa6"
import { UploadDropzone } from "@/lib/uploadthing-client"
import { createGalleryImage } from "@/lib/actions/gallery"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
  onUploadComplete?: (urls: string[]) => void
}

interface UploadedFile {
  url: string
  name: string
  size: number
}

export function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([])
  const [imageMetadata, setImageMetadata] = useState<
    Record<string, { title: string; description: string; tags: string }>
  >({})
  const [saving, setSaving] = useState(false)

  const handleUploadComplete = (res: any[]) => {
    const newFiles = res.map(file => ({
      url: file.url,
      name: file.name,
      size: file.size,
    }))

    setUploadedImages(prev => [...prev, ...newFiles])

    // Initialize metadata for new images
    const newMetadata = { ...imageMetadata }
    newFiles.forEach(file => {
      newMetadata[file.url] = { title: file.name.replace(/\.[^/.]+$/, ""), description: "", tags: "" }
    })
    setImageMetadata(newMetadata)

    toast.success(`${newFiles.length} image(s) uploaded successfully!`)
    onUploadComplete?.(newFiles.map(f => f.url))
  }

  const handleMetadataChange = (url: string, field: "title" | "description" | "tags", value: string) => {
    setImageMetadata(prev => ({
      ...prev,
      [url]: {
        ...prev[url],
        [field]: value,
      },
    }))
  }

  const removeImage = (urlToRemove: string) => {
    setUploadedImages(prev => prev.filter(file => file.url !== urlToRemove))
    setImageMetadata(prev => {
      const newMetadata = { ...prev }
      delete newMetadata[urlToRemove]
      return newMetadata
    })
  }

  const saveToGallery = async () => {
    setSaving(true)
    try {
      const savePromises = uploadedImages.map(async file => {
        const metadata = imageMetadata[file.url]
        const tags = metadata?.tags
          ? metadata.tags
              .split(",")
              .map(tag => tag.trim())
              .filter(Boolean)
          : []

        return createGalleryImage({
          url: file.url,
          name: file.name,
          title: metadata?.title || file.name.replace(/\.[^/.]+$/, ""),
          description: metadata?.description || "",
          size: file.size,
          tags,
          uploadedAt: new Date(),
        })
      })

      const results = await Promise.all(savePromises)
      const failedSaves = results.filter(result => !result.success)

      if (failedSaves.length === 0) {
        toast.success("All images saved to gallery!")
        // Reset form
        setUploadedImages([])
        setImageMetadata({})
      } else {
        toast.error(`Failed to save ${failedSaves.length} image(s)`)
      }
    } catch (error) {
      console.error("Error saving to gallery:", error)
      toast.error("Failed to save images to gallery")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaUpload size={20} />
            Upload Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`)
            }}
            appearance={{
              container:
                "border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors",
              uploadIcon: "text-gray-400",
              label: "text-gray-600 font-medium",
              allowedContent: "text-gray-500 text-sm",
              button: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors",
            }}
          />
        </CardContent>
      </Card>

      {uploadedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FaImage size={20} />
                Uploaded Images ({uploadedImages.length})
              </span>
              <Button
                onClick={saveToGallery}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? "Saving..." : "Save to Gallery"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uploadedImages.map((file, index) => (
                <div
                  key={file.url}
                  className="space-y-4 p-4 border rounded-lg"
                >
                  <div className="relative">
                    <Image
                      src={file.url || "/placeholder.svg"}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(file.url)}
                    >
                      <FaX size={12} />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`title-${index}`}>Title</Label>
                      <Input
                        id={`title-${index}`}
                        value={imageMetadata[file.url]?.title || ""}
                        onChange={e => handleMetadataChange(file.url, "title", e.target.value)}
                        placeholder="Enter image title..."
                      />
                    </div>

                    <div>
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={imageMetadata[file.url]?.description || ""}
                        onChange={e => handleMetadataChange(file.url, "description", e.target.value)}
                        placeholder="Enter image description..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`tags-${index}`}>Tags (comma separated)</Label>
                      <Input
                        id={`tags-${index}`}
                        value={imageMetadata[file.url]?.tags || ""}
                        onChange={e => handleMetadataChange(file.url, "tags", e.target.value)}
                        placeholder="nature, landscape, mountains..."
                      />
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>File: {file.name}</p>
                      <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
