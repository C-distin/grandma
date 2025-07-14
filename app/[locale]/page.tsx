"use client"

import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from 'next-intl'
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
import { FormattedNumber, PluralText } from "@/components/i18n/FormattedText"
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher"
import { useDirection } from "@/lib/i18n/utils"

export default function HomePage() {
  const t = useTranslations()
  const locale = useLocale()
  const direction = useDirection()

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
      title: locale === 'fr' ? "Faire un Vœu ou Ne Pas Faire de Vœu" : "To Vow or Not to Vow",
      cover: "/books/vow-cover.jpg",
      description: locale === 'fr' ? "Une exploration culturelle des vœux de mariage et des relations modernes." : "A cultural exploration of marriage vows and modern relationships.",
    },
    {
      slug: "behind-closed-doors",
      title: locale === 'fr' ? "Derrière les Portes Fermées : Protéger Vos Rêves" : "Behind Closed Doors: Guarding Your Dreams",
      cover: "/books/guarding-dreams.jpg",
      description: locale === 'fr' ? "Un guide pour nourrir les aspirations non exprimées et surmonter le doute de soi." : "A guide to nurturing unspoken aspirations and overcoming self-doubt.",
    },
  ]

  const stats = [
    { number: "2", labelKey: "numbers.booksCount", icon: FaBookOpen, count: 2 },
    { number: "50+", labelKey: "Speaking Events", icon: FaMicrophone },
    { number: "10+", labelKey: "Years Experience", icon: FaAward },
    { number: "1000+", labelKey: "numbers.readersCount", icon: FaUsers, count: 1000 },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Locale Switcher - Fixed position */}
      <div className="fixed top-20 right-4 z-40">
        <LocaleSwitcher />
      </div>

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
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${direction === 'rtl' ? 'lg:grid-flow-col-dense' : ''}`}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`text-center ${direction === 'rtl' ? 'lg:text-right' : 'lg:text-left'}`}
            >
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              >
                {t('home.title')}
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl mb-4 text-blue-100"
              >
                {t('home.subtitle')}
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-lg mb-8 text-blue-50 max-w-2xl"
              >
                {t('home.description')}
              </motion.p>
              <motion.div
                variants={itemVariants}
                className={`flex flex-col sm:flex-row gap-4 ${direction === 'rtl' ? 'justify-center lg:justify-end' : 'justify-center lg:justify-start'}`}
              >
                <Link href={`/${locale}/books`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2 shadow-lg"
                  >
                    <FaBookOpen size={20} />
                    {t('home.exploreBooks')}
                  </motion.button>
                </Link>
                <Link href={`/${locale}/speaking`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white hover:bg-white hover:text-indigo-700 px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
                  >
                    <FaMicrophone size={20} />
                    {t('home.bookSpeaking')}
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
                key={stat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.count ? (
                    <FormattedNumber value={stat.count} />
                  ) : (
                    stat.number
                  )}
                </div>
                <div className="text-gray-600">
                  {stat.count && stat.labelKey.startsWith('numbers.') ? (
                    <PluralText messageKey={stat.labelKey} count={stat.count} />
                  ) : (
                    stat.labelKey
                  )}
                </div>
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
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${direction === 'rtl' ? 'lg:grid-flow-col-dense' : ''}`}>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('home.aboutTitle')}</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {t('home.aboutDescription')}
              </p>
              <Link href={`/${locale}/about`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
                >
                  {t('home.learnMore')}
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

      {/* Newsletter Section */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t('home.stayConnected')}</h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('home.newsletterDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold"
            >
              {t('home.subscribe')}
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}