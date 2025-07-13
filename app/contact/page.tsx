import type { Metadata } from "next"
import { ContactPage } from "./contact"

export const metadata: Metadata = {
  title: "Contact - Margaret Kuofie",
  description: "Contact Margaret Kuofie - Author & Storyteller",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <ContactPage />
    </main>
  )
}
