"use client"

import { Tiptap } from "@/components/dashboard/Tiptap"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { blogTitleSchema } from "@/lib/utils/slugify"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { BlogPostInput } from "@/types/blog"

const formSchema = z.object({
  title: blogTitleSchema,
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverUrl: z.string().url("Invalid image URL").optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
})

export function BlogForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: BlogPostInput) => void
  initialData?: BlogPostInput
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { status: "draft" },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <Input
          placeholder="Title"
          {...register("title")}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <Tiptap
          content={watch("content") || ""}
          onUpdate={html => setValue("content", html, { shouldValidate: true })}
        />
        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
      </div>

      <div>
        <Input
          placeholder="Cover Image URL"
          {...register("coverUrl")}
        />
        {errors.coverUrl && <p className="text-sm text-red-500">{errors.coverUrl.message}</p>}
      </div>

      <div>
        <select
          {...register("status")}
          className="border rounded p-2 w-full"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <Button type="submit">Save</Button>
    </form>
  )
}
