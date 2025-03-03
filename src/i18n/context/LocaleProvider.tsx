import { PropsWithChildren, ReactNode, useCallback, useEffect, useState } from 'react'
import { AvailableLanguages, i18n } from '..'
import { component } from '../../util/component'
import { LocaleContext } from './contextHook'

export function LocaleProvider({ children }: PropsWithChildren) {
    const [lang, _setLang] = useState<AvailableLanguages>('en-US')

    const setLang = useCallback((lang: AvailableLanguages) => {
        _setLang(lang)
        localStorage.setItem('lang', lang)
    }, [])

    const t = useCallback(
        (path: string, components?: ReactNode[]) => {
            const obj = i18n.getLanguage(lang)
            const keys = path.split('.')
            let value = obj
            for (const key of keys) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value = (value as any)[key]
                if (!value) return path
            }

            if (typeof value !== 'string') return path
            if (components) {
                return component.insert(value, components)
            }
            return value
        },
        [lang]
    )

    const detectLang = useCallback(() => {
        const langs = navigator.languages

        const find = langs.find((lang) => i18n.languageKeys.includes(lang))
        if (find) return find as AvailableLanguages

        for (const lang of langs) {
            const firstPart = lang.split('-')[0]
            const find = i18n.languageKeys.find((key) => key.split('-')[0] === firstPart)
            if (find) return find as AvailableLanguages
        }

        return i18n.fallback
    }, [])

    useEffect(() => {
        const lang = localStorage.getItem('lang')
        if (lang && i18n.hasLanguage(lang)) {
            setLang(lang as AvailableLanguages)
        } else {
            const detected = detectLang()
            setLang(detected)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const value = {
        t,
        lang,
        setLang,
        detectLang,
    }

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
