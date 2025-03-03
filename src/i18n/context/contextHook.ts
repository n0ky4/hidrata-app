import { createContext, ReactNode, useContext } from 'react'
import { AvailableLanguages } from '..'

interface LocaleContext {
    t: (path: string, components?: ReactNode[]) => string | (string | ReactNode)[]
    lang: AvailableLanguages
    setLang: (lang: AvailableLanguages) => void
    detectLang: () => AvailableLanguages
}

export const LocaleContext = createContext<LocaleContext | null>(null)

export function useLocale() {
    const context = useContext(LocaleContext)
    if (!context) throw new Error('useLocale must be used within a LocaleProvider')
    return context
}
