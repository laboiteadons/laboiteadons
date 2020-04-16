import React from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import locale_fr from './locales/fr/translation.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            fr: { translation: locale_fr }
        },
        fallbackLng: 'en',
        debug: process.env.NODE_ENV !== "production",
        nsSeparator: false,
        keySeparator: false,
        interpolation: { escapeValue: false }
    })

export const I18nProvider: React.FC = ({ children }) => (
    <I18nextProvider i18n={i18n}>
        {children}
    </I18nextProvider>
)