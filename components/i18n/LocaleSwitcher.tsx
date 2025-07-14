'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaGlobe, FaChevronDown } from 'react-icons/fa6'
import { locales, type Locale } from '@/i18n/config'

const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية',
  zh: '中文'
}

const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  ar: '🇸🇦',
  zh: '🇨🇳'
}

export function LocaleSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(() => {
      // Remove the current locale from the pathname
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
      // Navigate to the new locale
      router.push(`/${newLocale}${pathWithoutLocale}`)
      setIsOpen(false)
    })
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isPending}
      >
        <FaGlobe className="text-slate-600" size={16} />
        <span className="text-sm font-medium text-slate-700">
          {localeFlags[locale]} {localeNames[locale]}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-slate-400" size={12} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-2 min-w-[160px]"
            >
              {locales.map((loc) => (
                <motion.button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                    loc === locale ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                  }`}
                  whileHover={{ x: 4 }}
                  disabled={isPending}
                >
                  <span className="text-lg">{localeFlags[loc]}</span>
                  <span className="font-medium">{localeNames[loc]}</span>
                  {loc === locale && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}