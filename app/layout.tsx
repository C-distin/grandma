import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Margaret Kuofie - Author & Storyteller",
  description:
    "Margaret Kuofie is an author and storyteller who explores themes of identity, resilience, and cultural duality.",
  openGraph: {
    title: "Margaret Kuofie - Author & Storyteller",
    description:
      "Margaret Kuofie is an author and storyteller who explores themes of identity, resilience, and cultural duality.",
    url: "https://margaretkuofie.com",
    siteName: "Margaret Kuofie",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Margaret Kuofie - Author & Storyteller",
    description:
      "Margaret Kuofie is an author and storyteller who explores themes of identity, resilience, and cultural duality.",
    creator: "@margaretkuofie",
    site: "@margaretkuofie",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <Toaster
          richColors
          position="top-right"
        />
        {children}
        <Footer />
      </body>
    </html>
  )
}