import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/types/blog"

export function BlogTable({
  posts,
  onEdit,
  onDelete,
}: {
  posts: BlogPost[]
  onEdit: (post: BlogPost) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">Title</th>
            <th className="p-2">Status</th>
            <th className="p-2">Created</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr
              key={post.id}
              className="border-t"
            >
              <td className="p-2 font-medium">{post.title}</td>
              <td className="p-2">
                <Badge>{post.status}</Badge>
              </td>
              <td className="p-2">{new Date(post.createdAt).toLocaleDateString()}</td>
              <td className="p-2 space-x-2">
                <Button
                  size="sm"
                  onClick={() => onEdit(post)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(post.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
