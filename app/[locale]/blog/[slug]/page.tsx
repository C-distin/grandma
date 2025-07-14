'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { 
  FaCalendar, 
  FaClock, 
  FaEye, 
  FaHeart, 
  FaShare,
  FaArrowLeft,
  FaTag
} from 'react-icons/fa6'
import { mockBlogPosts } from '@/lib/blog/mockData'
import { formatDate } from '@/lib/i18n/utils'
import { BlogPost } from '@/types/blog'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function BlogPostPage({ params }: PageProps) {
  const [slug, setSlug] = useState<string | null>(null)
  const [post, setPost] = useState<BlogPost | null>(null)
  const locale = useLocale()

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)

      const foundPost = mockBlogPosts.find(p => p.slug === resolvedParams.slug && p.status === 'published')
      if (!foundPost) {
        notFound()
      }
      setPost(foundPost)
    }

    resolveParams()
  }, [params])

  if (!slug || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const relatedPosts = mockBlogPosts
    .filter(p => p.id !== post.id && p.status === 'published' && p.category === post.category)
    .slice(0, 3)

  const renderContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 text-gray-900">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 text-gray-900">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/\n\n/gim, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/\n/gim, '<br>')
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href={`/${locale}/blog`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <FaArrowLeft size={16} />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="font-medium">{post.author.name}</span>
            </div>
            
            <span className="flex items-center gap-1">
              <FaCalendar size={14} />
              {formatDate(post.publishedAt || post.createdAt, locale)}
            </span>
            
            <span className="flex items-center gap-1">
              <FaClock size={14} />
              {post.readingTime} min read
            </span>
            
            <span className="flex items-center gap-1">
              <FaEye size={14} />
              {post.views.toLocaleString()} views
            </span>
          </div>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>
        </motion.header>

        {/* Featured Image */}
        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <div 
            dangerouslySetInnerHTML={{ 
              __html: `<p class="mb-4 text-gray-700 leading-relaxed">${renderContent(post.content)}</p>` 
            }}
          />
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <FaTag className="text-gray-400" size={16} />
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Article Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-12"
        >
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
              <FaHeart size={16} />
              {post.likes} Likes
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
              <FaShare size={16} />
              Share
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated: {formatDate(post.updatedAt, locale)}
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link
                  key={relatedPost.id}
                  href={`/${locale}/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                    {relatedPost.featuredImage && (
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </article>
    </div>
  )
}