"use client"

import { FaCalendarDay, FaDownload, FaMicrophone } from "react-icons/fa6"
import { motion } from "motion/react"
import Link from "next/link"

export function SpeakingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-24 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Speaking Engagements</h1>
          <p className="text-xl mb-8">
            Margaret brings her unique perspective to audiences worldwide, combining Biblical insights with
            health/scientific research and practical daily living to inspire and educate. Her talks bring humour to
            topics that are often difficult to grasp.
          </p>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
            >
              <FaCalendarDay size={20} />
              <span>Book a Session</span>
            </motion.button>
          </Link>
        </div>
      </motion.section>

      {/* Featured Talks Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Featured Talks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Talk 1 */}
            <motion.div
              className="bg-gray-100 p-6 rounded-lg shadow-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-3">"The Science of Storytelling"</h3>
              <p className="text-gray-800 mb-4">
                How clinical research principles can shape compelling narratives for personal and professional growth.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="/talks/science-of-storytelling.mp3"
                  className="text-purple-800 hover:underline flex items-center gap-2"
                >
                  <FaMicrophone size={16} />
                  <span>Listen Now</span>
                </a>
                <a
                  href="/talks/science-of-storytelling.mp3"
                  download
                  className="text-indigo-800 hover:underline flex items-center gap-2"
                >
                  <FaDownload size={16} />
                  <span>Download</span>
                </a>
              </div>
            </motion.div>

            {/* Talk 2 */}
            <motion.div
              className="bg-gray-100 p-6 rounded-lg shadow-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-3">"Guarding Your Dreams"</h3>
              <p className="text-gray-800 mb-4">
                A keynote on nurturing unspoken aspirations, inspired by Margaret's book <em>Behind Closed Doors</em>.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="/talks/guarding-dreams.mp3"
                  className="text-purple-800 hover:underline flex items-center gap-2"
                >
                  <FaMicrophone size={16} />
                  <span>Listen Now</span>
                </a>
                <a
                  href="/talks/guarding-dreams.mp3"
                  download
                  className="text-indigo-800 hover:underline flex items-center gap-2"
                >
                  <FaDownload size={16} />
                  <span>Download</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Audiences Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/*<motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-100 p-6 rounded-lg"
            >
              <p className="italic text-gray-800 mb-4">
                "Margaret’s blend of scientific insight and storytelling transformed our event!"
              </p>
              <p className="font-semibold text-gray-900">— Event Organizer, Toronto</p>
            </motion.div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-100 p-6 rounded-lg"
            >
              <p className="italic text-gray-800 mb-4">
                "Her AI-generated audio samples brought her books to life in a way we never expected."
              </p>
              <p className="font-semibold text-gray-900">— Publisher, New York</p>
            </motion.div> */}
          </div>
        </div>
      </section>
    </div>
  )
}
