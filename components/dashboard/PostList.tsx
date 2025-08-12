"use client"

import { formatDistanceToNow } from "date-fns"
import { motion } from "motion/react"
import { FaBoxArchive, FaClock, FaEye, FaHeart, FaPenToSquare, FaPlus, FaTrash } from "react-icons/fa6"
import { toast } from "sonner"
import { updatePost } from "@/actions/blog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { BlogPost } from "@/lib/validation/blog"

interface PostListProps {
  posts: BlogPost[]
  onCreateNew: () => void
  onEditPost: (post: BlogPost) => void
  onDeletePost: (id: string) => void
}

export function PostList({ posts, onCreateNew, onEditPost, onDeletePost }: PostListProps) {
  const handleArchivePost = async (postId: string) => {
    try {
      await updatePost(postId, { status: "archived" })
      toast.success("Post archived successfully")
    } catch (error) {
      console.error("Error archiving post:", error)
      toast.error("An error occurred while archiving the post")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Posts</h2>
          <p className="text-gray-600">{posts.length} posts total</p>
        </div>
        <Button
          onClick={onCreateNew}
          className="flex items-center gap-2"
        >
          <FaPlus size={16} /> Create New Post
        </Button>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FaPenToSquare
              className="mx-auto text-gray-400 mb-4"
              size={48}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first blog post.</p>
            <Button onClick={onCreateNew}>
              <FaPlus
                className="mr-2"
                size={16}
              />{" "}
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                          onClick={() => onEditPost(post)}
                        >
                          {post.title}
                        </h3>
                        <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaClock size={12} />
                          {formatDistanceToNow(new Date(post.createdAt!), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEye size={12} /> {post.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <FaHeart size={12} /> {post.likes} likes
                        </span>
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditPost(post)}
                      >
                        <FaPenToSquare size={14} />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            ⋮
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {post.status !== "archived" && (
                            <>
                              <DropdownMenuItem onClick={() => handleArchivePost(post.id!)}>
                                <FaBoxArchive
                                  className="mr-2"
                                  size={14}
                                />{" "}
                                Archive Post
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={e => e.preventDefault()}
                                className="text-red-600 focus:text-red-600"
                              >
                                <FaTrash
                                  className="mr-2"
                                  size={14}
                                />{" "}
                                Delete Post
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDeletePost(post.id!)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
