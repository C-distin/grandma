"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "motion/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  FaBookOpen,
  FaEnvelope,
  FaMapLocationDot,
  FaMugHot,
  FaPenFancy,
  FaPhone,
  FaRegPaperPlane,
} from "react-icons/fa6"
import { z } from "zod"

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  inquiryType: z.enum(["general", "collaboration", "speaking", "media"]),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiryType: "general",
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    // Simulate API call - replace with your server action
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log("Contact form submitted:", data)
    setIsSubmitted(true)
    reset()
    setIsSubmitting(false)

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Get In Touch</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            I'd love to hear from you. Whether you have a question about my work, want to collaborate, or just want to
            say hello, don't hesitate to reach out.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            variants={itemVariants}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                <FaBookOpen
                  className="text-blue-600"
                  size={24}
                />
                Let's Connect
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaEnvelope
                    className="text-blue-600 mt-1"
                    size={20}
                  />
                  <div>
                    <h3 className="font-medium text-slate-800">Email</h3>
                    <p className="text-slate-600">mkuofie@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaPhone
                    className="text-blue-600 mt-1"
                    size={20}
                  />
                  <div>
                    <h3 className="font-medium text-slate-800">Phone</h3>
                    <p className="text-slate-600">+1 (905) 920-2488</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaMapLocationDot
                    className="text-blue-600 mt-1"
                    size={20}
                  />
                  <div>
                    <h3 className="font-medium text-slate-800">Location</h3>
                    <p className="text-slate-600">Ontario, Canada</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What I'm Open To */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">What I'm Open To</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaPenFancy
                    className="text-green-600"
                    size={18}
                  />
                  <span className="text-slate-700">Writing Collaborations</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMugHot
                    className="text-orange-600"
                    size={18}
                  />
                  <span className="text-slate-700">Speaking Engagements</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaBookOpen
                    className="text-purple-600"
                    size={18}
                  />
                  <span className="text-slate-700">Book Reviews & Interviews</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope
                    className="text-blue-600"
                    size={18}
                  />
                  <span className="text-slate-700">Media Inquiries</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Send a Message</h2>

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-green-800 font-medium">Thank you for your message! I'll get back to you soon.</p>
                </motion.div>
              )}

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inquiryType"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Inquiry Type
                  </label>
                  <select
                    {...register("inquiryType")}
                    id="inquiryType"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="speaking">Speaking Engagement</option>
                    <option value="media">Media Inquiry</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    {...register("subject")}
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="What's this about?"
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder="Tell me more about your inquiry..."
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
                </div>

                <motion.button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaRegPaperPlane size={18} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Response Time Notice */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-200"
        >
          <p className="text-blue-800">
            I typically respond to messages within 24-48 hours. For urgent inquiries, please call or send an email
            directly.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
