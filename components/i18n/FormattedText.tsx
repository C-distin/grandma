'use client'

import { useLocale, useTranslations } from 'next-intl'
import { formatDate, formatNumber, formatCurrency, formatRelativeTime } from '@/lib/i18n/utils'

interface FormattedDateProps {
  date: Date
  options?: Intl.DateTimeFormatOptions
  className?: string
}

export function FormattedDate({ date, options, className }: FormattedDateProps) {
  const locale = useLocale()
  
  return (
    <time dateTime={date.toISOString()} className={className}>
      {formatDate(date, locale, options)}
    </time>
  )
}

interface FormattedNumberProps {
  value: number
  options?: Intl.NumberFormatOptions
  className?: string
}

export function FormattedNumber({ value, options, className }: FormattedNumberProps) {
  const locale = useLocale()
  
  return (
    <span className={className}>
      {formatNumber(value, locale, options)}
    </span>
  )
}

interface FormattedCurrencyProps {
  amount: number
  currency?: string
  className?: string
}

export function FormattedCurrency({ amount, currency = 'USD', className }: FormattedCurrencyProps) {
  const locale = useLocale()
  
  return (
    <span className={className}>
      {formatCurrency(amount, locale, currency)}
    </span>
  )
}

interface FormattedRelativeTimeProps {
  date: Date
  baseDate?: Date
  className?: string
}

export function FormattedRelativeTime({ date, baseDate, className }: FormattedRelativeTimeProps) {
  const locale = useLocale()
  
  return (
    <time dateTime={date.toISOString()} className={className}>
      {formatRelativeTime(date, locale, baseDate)}
    </time>
  )
}

interface PluralTextProps {
  messageKey: string
  count: number
  values?: Record<string, any>
  className?: string
}

export function PluralText({ messageKey, count, values, className }: PluralTextProps) {
  const t = useTranslations()
  
  return (
    <span className={className}>
      {t(messageKey, { count, ...values })}
    </span>
  )
}