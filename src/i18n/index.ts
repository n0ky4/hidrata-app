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

export const i18n = {
    getLanguage,
    hasLanguage,
    languageKeys,
    availableLanguages,
    fallback,
}
