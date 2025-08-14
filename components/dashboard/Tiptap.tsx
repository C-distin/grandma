"use clinet"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import Highlight from "@tiptap/extension-highlight"
import Heading from "@tiptap/extension-heading"
import Blockquote from "@tiptap/extension-blockquote"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Palette,
} from "lucide-react"

interface TiptapProps {
  content: string
  onUpdate: (html: string) => void
}

export function Tiptap({ content, onUpdate }: TiptapProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      Link.configure({
        HTMLAttributes: {
          target: "_blank",
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg h-auto max-w-full",
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      TextStyle,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Blockquote,
    ],
    content: content,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
    editorProps: {
      attributes: {
        spellcheck: "true",
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4",
      },
    },
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setShowImageInput(false)
    }
  }

  const colors = [
    "#000000",
    "#374151",
    "#DC2626",
    "#EA580C",
    "#D97706",
    "#65A30D",
    "#059669",
    "#0891B2",
    "#2563EB",
    "#7C3AED",
    "#C026D3",
    "#DC2626",
  ]

  return (
    <Card className="w-full">
      {/* Toolbar */}
      <div className="border-b p-4">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1">
            <Button
              variant={editor.isActive("bold") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("italic") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("underline") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("strike") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("code") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="h-8"
          />

          {/* Headings */}
          <div className="flex gap-1">
            <Button
              variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="h-8"
          />

          {/* Lists */}
          <div className="flex gap-1">
            <Button
              variant={editor.isActive("bulletList") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("orderedList") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("blockquote") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="h-8"
          />

          {/* Alignment */}
          <div className="flex gap-1">
            <Button
              variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: "center" }) ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: "right" }) ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: "justify" }) ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="h-8"
          />

          {/* Color and Highlight */}
          <div className="flex gap-1 relative">
            <Button
              variant={editor.isActive("highlight") ? "default" : "outline"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Palette className="h-4 w-4" />
            </Button>
            {showColorPicker && (
              <div className="absolute top-10 left-0 z-10 bg-white border rounded-lg p-2 shadow-lg">
                <div className="grid grid-cols-6 gap-1">
                  {colors.map(color => (
                    <button
                      type="button"
                      key={color}
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run()
                        setShowColorPicker(false)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator
            orientation="vertical"
            className="h-8"
          />

          {/* Media */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLinkInput(!showLinkInput)}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImageInput(!showImageInput)}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="h-8"
          />

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Link Input */}
        {showLinkInput && (
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addLink()}
            />
            <Button onClick={addLink}>Add Link</Button>
            <Button
              variant="outline"
              onClick={() => setShowLinkInput(false)}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Image Input */}
        {showImageInput && (
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addImage()}
            />
            <Button onClick={addImage}>Add Image</Button>
            <Button
              variant="outline"
              onClick={() => setShowImageInput(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="border-t p-4 text-sm text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Words: {editor.storage.characterCount?.words() || 0}</span>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.commands.clearContent()}
            >
              Clear All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const html = editor.getHTML()
                navigator.clipboard.writeText(html)
              }}
            >
              Copy HTML
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
