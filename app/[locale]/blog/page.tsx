'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { 
  FaCalendar, 
  FaClock, 
  FaEye, 
  FaHeart, 
  FaArrowRight,
  FaSearch,
  FaFilter
} from 'react-icons/fa6'
import { mockBlogPosts, mockCategories } from '@/lib/blog/mockData'
import { formatDate } from '@/lib/i18n/utils'
import { useState } from 'react'

export default function BlogPage() {
  const locale = useLocale()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const publishedPosts = mockBlogPosts.filter(post => post.status === 'published')
  
  const filteredPosts = publishedPosts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const featuredPost = filteredPosts[0]
  const otherPosts = filteredPosts.slice(1)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
          <p className="text-xl mb-8 text-blue-100">
            Insights, stories, and thoughts on writing, research, and life
          </p>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {mockCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      {featuredPost.featuredImage && (
                        <Image
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          width={600}
                          height={400}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          Featured
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {featuredPost.category}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {featuredPost.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <FaCalendar size={12} />
                          {formatDate(featuredPost.publishedAt || featuredPost.createdAt, locale)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock size={12} />
                          {featuredPost.readingTime} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEye size={12} />
                          {featuredPost.views.toLocaleString()}
                        </span>
                      </div>
                      
                      <Link href={`/${locale}/blog/${featuredPost.slug}`}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Read More
                          <FaArrowRight size={14} />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other Posts Grid */}
            {otherPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {post.featuredImage && (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: mockCategories.find(c => c.name === post.category)?.color + '20',
                            color: mockCategories.find(c => c.name === post.category)?.color
                          }}
                        >
                          {post.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <FaCalendar size={10} />
                          {formatDate(post.publishedAt || post.createdAt, locale)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock size={10} />
                          {post.readingTime}m
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEye size={10} />
                          {post.views}
                        </span>
                      </div>
                      
                      <Link href={`/${locale}/blog/${post.slug}`}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Read More
                          <FaArrowRight size={12} />
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}