'use client'

import { useLocale } from 'next-intl'
import { useEffect } from 'react'
import { useDirection } from '@/lib/i18n/utils'

interface RTLProviderProps {
  children: React.ReactNode
}

export function RTLProvider({ children }: RTLProviderProps) {
  const locale = useLocale()
  const direction = useDirection()

  useEffect(() => {
    // Set document direction
    document.documentElement.dir = direction
    document.documentElement.lang = locale
    
    // Add RTL class to body for styling
    if (direction === 'rtl') {
      document.body.classList.add('rtl')
    } else {
      document.body.classList.remove('rtl')
    }
  }, [direction, locale])

  return (
    <div dir={direction} className={direction}>
      {children}
    </div>
  )
}