import en from './locales/en.json'
import id from './locales/id.json'

export const locales = ['en', 'id'] as const
export type Locale = (typeof locales)[number]

const translations: Record<Locale, typeof en> = {
  en,
  id
}

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.')
  let value: any = translations[locale]

  for (const k of keys) {
    value = value?.[k]
  }

  return typeof value === 'string' ? value : key
}

export default function useTranslation(locale: Locale) {
  return {
    t: (key: string) => getTranslation(locale, key),
    locale
  }
}
