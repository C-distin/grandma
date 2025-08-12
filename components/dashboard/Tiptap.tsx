"use client"

import React, { useMemo, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { createClient } from "@supabase/supabase-js"
import { toast, Toaster } from "sonner"

export function Tiptap() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const supabase = useMemo(() => {
    if (
      typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    }
    return null
  }, [])

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>Start writing here...</p>",
  })

  const addImage = async () => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = "image/*"

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0]
      if (!file) return

      if (!supabase) {
        toast.error("Supabase client not available.")
        return
      }

      setUploading(true)
      setProgress(0)

      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from("blog-images").upload(fileName, file, {
        upsert: false,
      })

      if (error) {
        toast.error("Image upload failed")
        setUploading(false)
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("editor-images").getPublicUrl(fileName)

      // Simulate progress (since Supabase JS doesn't expose byte-level progress yet)
      let fakeProgress = 0
      const interval = setInterval(() => {
        fakeProgress += 20
        setProgress(fakeProgress)
        if (fakeProgress >= 100) {
          clearInterval(interval)
          setUploading(false)
          toast.success("Image uploaded successfully")
          editor?.chain().focus().setImage({ src: publicUrl }).run()
        }
      }, 100)
    }

    fileInput.click()
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-2 p-2 bg-white/70 backdrop-blur-md border-b shadow-md">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="px-2 py-1 border rounded hover:bg-gray-100"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="px-2 py-1 border rounded hover:bg-gray-100"
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className="px-2 py-1 border rounded hover:bg-gray-100"
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={addImage}
          disabled={uploading}
          className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          {uploading ? `Uploading... ${progress}%` : "Add Image"}
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="p-4 min-h-[200px]"
      />
      <Toaster
        position="top-right"
        richColors
      />
    </div>
  )
}
