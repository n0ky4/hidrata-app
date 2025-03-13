import { PropsWithChildren, ReactNode, useCallback, useEffect, useState } from 'react'
import { AvailableLanguages, i18n } from '..'
import { component } from '../../util/component'
import { LSKEY } from '../../util/localStorageKeys'
import { LocaleContext } from './contextHook'

export function LocaleProvider({ children }: PropsWithChildren) {
    const [lang, setShownLanguage] = useState<AvailableLanguages>('en-US')

    const storeLang = useCallback((lang: AvailableLanguages) => {
        localStorage.setItem(LSKEY.LANG, lang)
    }, [])

    const getStoredLang = useCallback(() => {
        const stored = localStorage.getItem(LSKEY.LANG)
        if (!stored || !i18n.hasLanguage(stored)) return null
        return stored as AvailableLanguages
    }, [])

    const setAppLanguage = useCallback(
        (lang: AvailableLanguages) => {
            setShownLanguage(lang)
            storeLang(lang)
        },
        [storeLang]
    )

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

            if (Array.isArray(value)) {
                return value.map((v) => {
                    if (typeof v !== 'string') return path
                    if (components) {
                        return component.insert(v, components)
                    }
                    return v
                })
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
        const storedLanguage = getStoredLang()

        if (storedLanguage) {
            setShownLanguage(storedLanguage as AvailableLanguages)
        } else {
            const detected = detectLang()
            setAppLanguage(detected)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const value = {
        t,
        lang,
        setAppLanguage,
        detectLang,
    }

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
