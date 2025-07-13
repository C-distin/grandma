import type { Metadata } from "next"
import { AboutPage } from "./about"

export const metadata: Metadata = {
  title: "About - Margaret Kuofie",
  description: "About Margaret Kuofie - Author & Storyteller",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <AboutPage />
    </main>
  )
}
