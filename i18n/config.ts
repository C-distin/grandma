import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

// Can be imported from a shared config
export const locales = ["en", "es", "fr", "ar", "zh"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: getTimeZoneForLocale(locale),
    now: new Date(),
  }
})

function getTimeZoneForLocale(locale: string): string {
  const timeZoneMap: Record<string, string> = {
    en: "America/New_York",
    es: "Europe/Madrid",
    fr: "Europe/Paris",
    ar: "Asia/Dubai",
    zh: "Asia/Shanghai",
  }
  return timeZoneMap[locale] || "UTC"
}
