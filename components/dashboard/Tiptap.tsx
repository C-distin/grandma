"use client"

import React, { useMemo, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Heading from "@tiptap/extension-heading"
import Blockquote from "@tiptap/extension-blockquote"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { createClient } from "@supabase/supabase-js"
import { toast, Toaster } from "sonner"

interface TiptapProps {
  content: string
  onUpdate: (html: string) => void
}

export function Tiptap({ content, onUpdate }: TiptapProps) {
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
    extensions: [
      StarterKit.configure({
        heading: false, // disable default heading to use custom Heading below
      }),
      Image,
      Heading.configure({ levels: [1, 2] }),
      Blockquote,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
    editorProps: {
      attributes: {
        spellcheck: "true",
      },
    },
    immediatelyRender: false,
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
      const { data, error } = await supabase.storage.from("editor-images").upload(fileName, file, {
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

      // Simulate progress
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

  const isActive = (type: string, options?: any) => editor?.isActive(type, options)

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 p-2 bg-white/70 backdrop-blur-md border-b shadow-md">
        {/* Basic styles */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${isActive("bold") ? "bg-purple-600 text-white" : ""}`}
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("italic") ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("underline") ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Underline"
        >
          U
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("blockquote") ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Blockquote"
        >
          "
        </button>

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("heading", { level: 1 }) ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("heading", { level: 2 }) ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Heading 2"
        >
          H2
        </button>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("bulletList") ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("orderedList") ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Ordered List"
        >
          1. List
        </button>

        {/* Text alignments */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("textAlign", { align: "left" }) ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Align Left"
        >
          L
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("textAlign", { align: "center" }) ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Align Center"
        >
          C
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("textAlign", { align: "right" }) ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Align Right"
        >
          R
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
          className={`px-2 py-1 border rounded hover:bg-gray-100 ${
            isActive("textAlign", { align: "justify" }) ? "bg-purple-600 text-white" : ""
          }`}
          aria-label="Align Justify"
        >
          J
        </button>

        {/* Image upload */}
        <button
          type="button"
          onClick={addImage}
          disabled={uploading}
          className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          aria-label="Add Image"
        >
          {uploading ? `Uploading... ${progress}%` : "Add Image"}
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="p-4 min-h-[500px]"
      />
      <Toaster
        position="top-right"
        richColors
      />
    </div>
  )
}
