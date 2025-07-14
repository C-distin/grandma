"use client"

import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import {
  FaArrowRight,
  FaAward,
  FaBookOpen,
  FaCalendarDay,
  FaEnvelope,
  FaMicrophone,
  FaQuoteLeft,
  FaStar,
  FaUsers,
} from "react-icons/fa6"

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const books = [
    {
      slug: "to-vow-or-not-to-vow",
      title: "To Vow or Not to Vow",
      cover: "/books/vow-cover.jpg",
      description: "A cultural exploration of marriage vows and modern relationships.",
    },
    {
      slug: "behind-closed-doors",
      title: "Behind Closed Doors: Guarding Your Dreams",
      cover: "/books/guarding-dreams.jpg",
      description: "A guide to nurturing unspoken aspirations and overcoming self-doubt.",
    },
  ]

  const stats = [
    { number: "2", label: "Published Books", icon: FaBookOpen },
    { number: "50+", label: "Speaking Events", icon: FaMicrophone },
    { number: "10+", label: "Years Experience", icon: FaAward },
    { number: "1000+", label: "Readers Inspired", icon: FaUsers },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-20 px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Margaret E. Kuofie
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl mb-4 text-blue-100"
              >
                Author | Clinical Research Professional | Storyteller
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-lg mb-8 text-blue-50 max-w-2xl"
              >
                Crafting stories that bridge science and humanity, exploring themes of identity, resilience, and
                cultural duality through compelling narratives.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/books">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2 shadow-lg"
                  >
                    <FaBookOpen size={20} />
                    Explore My Books
                  </motion.button>
                </Link>
                <Link href="/speaking">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white hover:bg-white hover:text-indigo-700 px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
                  >
                    <FaMicrophone size={20} />
                    Book Speaking
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full"></div>
                <Image
                  src="/margaret-profile.jpg"
                  alt="Margaret E. Kuofie"
                  width={320}
                  height={320}
                  className="rounded-full shadow-2xl object-cover w-full h-full"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-gray-50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Preview */}
      <motion.section
        className="py-20 px-6 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Margaret</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Margaret E. Kuofie is a certified clinical research professional with over a decade of experience in
                healthcare. Her writing blends scientific rigor with emotional depth, exploring themes of identity,
                resilience, and cultural duality.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                As the author of "To Vow or Not to Vow" and "Behind Closed Doors: Guarding Your Dreams", she empowers
                readers to embrace their unspoken aspirations and navigate the complexities of modern life.
              </p>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
                >
                  Learn More About Me
                  <FaArrowRight size={18} />
                </motion.button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8">
                <FaQuoteLeft
                  className="text-indigo-600 mb-4"
                  size={32}
                />
                <blockquote className="text-xl text-gray-800 italic mb-4">
                  "Writing is my way of bridging the gap between scientific understanding and human emotion, creating
                  stories that resonate across cultures and experiences."
                </blockquote>
                <cite className="text-indigo-600 font-semibold">— Margaret E. Kuofie</cite>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Books */}
      <motion.section
        className="py-20 px-6 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Books</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore stories that blend clinical insight, cultural reflection, and personal growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {books.map((book, index) => (
              <motion.div
                key={book.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      width={200}
                      height={300}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{book.title}</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>
                    <Link href={`/books/${book.slug}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-2"
                      >
                        Learn More
                        <FaArrowRight size={16} />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/books">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <FaBookOpen size={20} />
                View All Books
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Speaking Preview */}
      <motion.section
        className="py-20 px-6 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Speaking Engagements</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Margaret brings her unique perspective to audiences worldwide, combining scientific insight with
                storytelling to inspire and educate. Her talks bridge the gap between research and real-world
                application.
              </p>

              {/* <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">"The Science of Storytelling"</h4>
                    <p className="text-gray-600">How clinical research principles shape compelling narratives</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">"Guarding Your Dreams"</h4>
                    <p className="text-gray-600">Nurturing unspoken aspirations in a challenging world</p>
                  </div>
                </div>
              </div> */}

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/speaking">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
                  >
                    <FaMicrophone size={18} />
                    View Speaking Info
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
                  >
                    <FaCalendarDay size={18} />
                    Book Margaret
                  </motion.button>
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <FaMicrophone
                    className="text-indigo-600 mx-auto mb-4"
                    size={48}
                  />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Featured Talk</h3>
                  <p className="text-gray-600">"The Science of Storytelling"</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FaStar
                        className="text-indigo-600"
                        size={20}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Audience Feedback</p>
                      <p className="text-sm text-gray-600">Toronto Event, 2024</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic">
                    "Margaret's blend of scientific insight and storytelling transformed our event! Her ability to
                    connect research with human experience is truly remarkable."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Latest Stories Preview */}
      {/* <motion.section
        className="py-20 px-6 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Stories & Insights</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover thoughts, experiences, and insights from Margaret's journey as an author and researcher
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100"></div>
                <div className="p-6">
                  <div className="text-sm text-indigo-600 font-semibold mb-2">Blog Post</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Sample Story Title {item}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    A preview of the story content that would appear here, giving readers a taste of what to expect...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Dec {item}, 2024</span>
                    <Link href="/stories" className="text-indigo-600 hover:text-indigo-800 font-semibold">
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/stories">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <PenTool size={20} />
                Read All Stories
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section> */}

      {/* CTA Section */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
          <p className="text-xl mb-8 text-blue-100">
            Whether you're interested in my books, want to book a speaking engagement, or simply want to share your
            thoughts, I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2 shadow-lg"
              >
                <FaEnvelope size={20} />
                Get In Touch
              </motion.button>
            </Link>
            <Link href="/speaking">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-700 px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <FaCalendarDay size={20} />
                Book Speaking Event
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
