import React from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
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