"use client"

import { motion } from "motion/react"
import Link from "next/link"
import type React from "react"
import { useEffect, useState } from "react"
import { FaAngleUp, FaFacebookF, FaHeart, FaInstagram, FaLinkedinIn } from "react-icons/fa6"

interface SocialLink {
  name: string
  icon: React.ComponentType<{ size?: number }>
  href: string
  color: string
}

interface FooterLink {
  name: string
  href: string
}

interface FooterSection {
  [key: string]: FooterLink[]
}

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const socialLinks: SocialLink[] = [
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://instagram.com/margaretkuofie",
      color: "hover:text-pink-500",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      href: "https://linkedin.com/in/margaretkuofie",
      color: "hover:text-blue-600",
    },
    { name: "Facebook", icon: FaFacebookF, href: "https://facebook.com/margaretkuofie", color: "hover:text-blue-500" },
  ]

  const footerLinks: FooterSection = {
    Explore: [
      { name: "About Me", href: "/about" },
      { name: "My Books", href: "/books" },
      { name: "Blog Posts", href: "/blog" },
      { name: "Speaking Events", href: "/speaking" },
    ],
    Connect: [
      { name: "Contact", href: "/contact" },
      { name: "Newsletter", href: "/newsletter" },
    ],
    Resources: [
      { name: "Writing Tips", href: "/writing-tips" },
      { name: "Reading List", href: "/reading-list" },
      { name: "FAQs", href: "/faq" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  }

  return (
    <>
      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0,
        }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <FaAngleUp size={20} />
      </motion.button>

      <footer className="bg-slate-900 text-white">
        {/* Newsletter Signup Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Get updates on new releases, upcoming events, and exclusive content delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 hover:bg-slate-100 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Author Info */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="flex items-center gap-3 mb-4"
              >
                <div>
                  <h2 className="text-2xl font-bold">Margaret Kuofie</h2>
                  <p className="text-slate-400">Author & Storyteller</p>
                </div>
              </Link>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Crafting stories that bridge cultures and touch hearts. Based in Ghana, writing for the world.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map(social => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-slate-400 ${social.color} transition-colors`}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Follow on ${social.name}`}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-white mb-4">{category}</h3>
                <ul className="space-y-2">
                  {links.map(link => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span>© {new Date().getFullYear()} Margaret Kuofie. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span>Made with</span>
                <FaHeart
                  className="text-red-500 fill-current"
                  size={16}
                />
                <span>in Ghana</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
