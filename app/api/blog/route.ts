import { NextResponse } from "next/server"
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from "@/actions/blog"

// GET all posts
export async function GET() {
  try {
    const posts = await getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST create new post
export async function POST(req: Request) {
  try {
    const body = await req.json()
    await createPost(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}

// PUT update post
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    await updatePost(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

// DELETE post
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await deletePost(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
