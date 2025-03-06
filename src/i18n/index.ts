import { SelectOption } from '../components/Select'
import enUS from './locales/en-US.json'
import ptBR from './locales/pt-BR.json'

const availableLanguages = {
    'en-US': enUS,
    'pt-BR': ptBR,
} as const
const languageKeys = Object.keys(availableLanguages)
export type AvailableLanguages = keyof typeof availableLanguages

const fallback: AvailableLanguages = 'en-US'

function getLanguage(key: string) {
    const find = languageKeys.find((lang) => lang === key)
    if (!find) return availableLanguages[fallback]
    return availableLanguages[find as AvailableLanguages]
}

function hasLanguage(key: string) {
    return languageKeys.includes(key)
}

function getString(path: string, lang: AvailableLanguages = fallback) {
    const obj = getLanguage(lang)
    const keys = path.split('.')
    let value = obj
    for (const key of keys) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value = (value as any)[key]
        if (!value) return path
    }
    if (typeof value !== 'string') return path
    return value
}

function getLanguageOptions(): SelectOption[] {
    return languageKeys.map((lang) => ({
        label: getString('language', lang as AvailableLanguages),
        value: lang,
    }))
}

export const i18n = {
    getLanguage,
    hasLanguage,
    languageKeys,
    availableLanguages,
    fallback,
    getString,
    getLanguageOptions,
}
