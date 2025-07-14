import { useLocale, useTranslations } from 'next-intl'
import { Locale } from '@/i18n/config'

// Utility function to format numbers based on locale
export function formatNumber(
  number: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number)
}

// Utility function to format currency
export function formatCurrency(
  amount: number,
  locale: string,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

// Utility function to format dates
export function formatDate(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date)
}

// Utility function to format relative time
export function formatRelativeTime(
  date: Date,
  locale: string,
  baseDate: Date = new Date()
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const diffInSeconds = Math.floor((date.getTime() - baseDate.getTime()) / 1000)
  
  const intervals = [
    { unit: 'year' as const, seconds: 31536000 },
    { unit: 'month' as const, seconds: 2592000 },
    { unit: 'day' as const, seconds: 86400 },
    { unit: 'hour' as const, seconds: 3600 },
    { unit: 'minute' as const, seconds: 60 },
    { unit: 'second' as const, seconds: 1 },
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      return rtf.format(diffInSeconds < 0 ? -count : count, interval.unit)
    }
  }
  
  return rtf.format(0, 'second')
}

// Hook for getting locale-specific direction
export function useDirection(): 'ltr' | 'rtl' {
  const locale = useLocale()
  const rtlLocales = ['ar', 'he', 'fa', 'ur']
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr'
}

// Hook for getting locale-specific text alignment
export function useTextAlign(): 'left' | 'right' {
  const direction = useDirection()
  return direction === 'rtl' ? 'right' : 'left'
}

// Utility function to get locale-specific class names
export function getDirectionClasses(locale: string): string {
  const rtlLocales = ['ar', 'he', 'fa', 'ur']
  const isRTL = rtlLocales.includes(locale)
  
  return isRTL ? 'rtl' : 'ltr'
}

// Custom hook for pluralization
export function usePlural() {
  const t = useTranslations()
  
  return (key: string, count: number, options?: Record<string, any>) => {
    return t(key, { count, ...options })
  }
}

// Utility function to get browser locale
export function getBrowserLocale(): string {
  if (typeof window !== 'undefined') {
    return window.navigator.language.split('-')[0]
  }
  return 'en'
}

// Utility function to validate locale
export function isValidLocale(locale: string, supportedLocales: readonly string[]): boolean {
  return supportedLocales.includes(locale)
}