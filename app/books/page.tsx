import type { Metadata } from "next"
import { BooksPage } from "./books"

export const metadata: Metadata = {
  title: "Books - Margaret Kuofie",
  description: "Books by Margaret Kuofie - Author & Storyteller",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <BooksPage />
    </main>
  )
}
