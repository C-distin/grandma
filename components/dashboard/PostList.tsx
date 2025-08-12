"use client"

import { formatDistanceToNow } from "date-fns"
import { motion } from "motion/react"
import { useEffect, useState, useCallback } from "react"
import {
  FaBoxArchive,
  FaClock,
  FaEye,
  FaHeart,
  FaMagnifyingGlass,
  FaPenToSquare,
  FaPlus,
  FaTrash,
} from "react-icons/fa6"
import { toast } from "sonner"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type BlogPost, blogPostSchema } from "@/lib/validation/blog"

// Import your server actions
import { getAllPosts, deletePost, updatePost } from "@/actions/blog"

interface PostListProps {
  onCreateNew: () => void
  onEditPost: (post: BlogPost) => void
}

export function PostList({ onCreateNew, onEditPost }: PostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // Load posts (wrapped in useCallback to avoid unnecessary re-renders)
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getAllPosts()
      if (Array.isArray(result)) {
        setPosts(result)
      } else {
        toast.error("Failed to load posts")
      }
    } catch (error) {
      console.error("Error loading posts:", error)
      toast.error("An error occurred while loading posts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId)
      toast.success("Post deleted successfully")
      loadPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("An error occurred while deleting the post")
    }
  }

  const handleArchivePost = async (postId: string) => {
    try {
      await updatePost(postId, { status: "archived" })
      toast.success("Post archived successfully")
      loadPosts()
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="animate-pulse"
          >
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
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
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
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
                              <DropdownMenuItem onClick={() => handleArchivePost(post.id)}>
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
                                  onClick={() => handleDeletePost(post.id)}
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
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    {post.tags?.slice(0, 3).map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags?.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
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
