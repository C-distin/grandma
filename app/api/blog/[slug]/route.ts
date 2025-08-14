import { NextResponse } from "next/server"
import { getPostBySlug, updatePost, deletePost } from "@/actions/blog"

// GET post by slug
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

{
  /*
// PUT update post by slug
export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    const data = await req.json()
    await updatePost(params.slug, data, "slug") // modify updatePost to accept column type
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

// DELETE post by slug
export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    await deletePost(params.slug) // modify deletePost to accept column type
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
*/
}
