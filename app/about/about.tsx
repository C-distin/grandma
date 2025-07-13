"use client"

import { FaEnvelope, FaBookOpen, FaBriefcase } from "react-icons/fa6"
import { motion } from "motion/react"
import Image from "next/image"

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-24 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Margaret E. Kuofie</h1>
          <p className="text-xl mb-8">Author | Clinical Research Professional | Storyteller</p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
          >
            <FaEnvelope size={20} />
            <span>Contact Me</span>
          </motion.a>
        </div>
      </motion.section>

      {/* Bio Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row gap-10 items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="md:w-1/3">
              <Image
                src="/margaret-profile.jpg"
                alt="Margaret Kuofie"
                width={400}
                height={400}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About Margaret</h2>
              <p className="text-gray-700 mb-4">
                Margaret E. Kuofie is a certified clinical research professional with over four decades of experience in
                healthcare. Her writing blends Biblical insights with scientific facts, exploring themes of faith,
                health and daily living in this day and age.
              </p>
              <p className="text-gray-700 mb-4">
                As the author of <em>"To Vow or Not to Vow"</em> and{" "}
                <em>"Behind Closed Doors: Guarding Your Dreams"</em>, she empowers readers to be focused on applying
                scripture to every area of their lives.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3">
                  <FaBriefcase
                    className="text-indigo-600"
                    size={24}
                  />
                  <span>Clinical Research Expert</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaBookOpen
                    className="text-indigo-600"
                    size={24}
                  />
                  <span>Bestselling Author</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
