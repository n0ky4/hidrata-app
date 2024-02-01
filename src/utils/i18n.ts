import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './../../locales/en.json'
import pt_BR from './../../locales/pt-BR.json'

const locales = {
    'pt-BR': pt_BR,
    en,
} as const

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        debug: true,
        detection: {
            order: [
                'querystring',
                'cookie',
                'localStorage',
                'sessionStorage',
                'navigator',
                'htmlTag',
                'path',
                'subdomain',
            ],
            lookupQuerystring: 'lng',
            lookupCookie: 'lang',
            lookupLocalStorage: 'lang',
            lookupSessionStorage: 'lang',
        },
        resources: locales,
    })
