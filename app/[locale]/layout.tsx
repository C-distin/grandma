import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from "sonner"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { RTLProvider } from "@/components/i18n/RTLProvider"
import { locales } from '@/i18n/config'
import "../globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

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

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <RTLProvider>
            <Header />
            <Toaster
              richColors
              position="top-right"
            />
            {children}
            <Footer />
          </RTLProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}