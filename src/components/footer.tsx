import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Nav, NavItem, Container } from 'reactstrap'
import { useTranslation } from 'react-i18next'

export const Footer = React.memo(() => {
  const { t } = useTranslation()
  return (
    <Container className="py-5">
      <div className="row">
        <div className="col-12 col-lg-3">
          <Link to="/" className="h4 text-light">La Boîte à Dons</Link>
        </div>

        <div className="col-6 col-lg-3">
          <Nav className="flex-column">
            <NavItem><NavLink to="/" className="nav-link">{t('Home')}</NavLink></NavItem>
            <NavItem><NavLink to="/donate" className="nav-link">{t('Donate')}</NavLink></NavItem>
            <NavItem><NavLink to="/causes" className="nav-link">{t('Causes')}</NavLink></NavItem>
            <NavItem><NavLink to="/about" className="nav-link">{t('About')}</NavLink></NavItem>
          </Nav>
        </div>

        <div className="col-6 col-lg-3">
          <Nav className="flex-column">
            <NavItem><a href="https://laboiteadons.org" className="nav-link" target="_blank" rel="noreferrer noopener">{t('Portal')}</a></NavItem>
            <NavItem><a href="https://github.com/laboiteadons" className="nav-link" target="_blank" rel="noreferrer noopener">{t('Code')}</a></NavItem>
            <NavItem><a href="https://gitter.im/laboiteadons/community" className="nav-link" target="_blank" rel="noreferrer noopener">{t('Community')}</a></NavItem>
            <NavItem><a href="https://organigr.am/org/laboiteadons" className="nav-link" target="_blank" rel="noreferrer noopener">{t('Governance')}</a></NavItem>
          </Nav>
        </div>

        <div className="col-4 col-lg-3">
          <div className="my-3">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </Container>
  )
})

export default Footer

export const LanguageSelector = () => {
  const { i18n } = useTranslation()
  return (
    <select className="form-control" value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}>
      {
        [
          {
            code: 'en',
            name: "English"
          },
          {
            code: 'fr',
            name: "Français"
          }
        ].map(lang => <option value={lang.code} key={lang.code}>{lang.name}</option>)
      }
    </select>
  )
}