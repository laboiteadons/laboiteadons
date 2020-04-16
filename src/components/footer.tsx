import React from 'react'
import { Nav, NavItem, Container } from 'reactstrap'
import { useTranslation } from 'react-i18next'

export const Footer = React.memo(() => {
    const { t } = useTranslation()
    return (
        <Container className="py-5">
            <div className="row">
                <div className="col-12 col-lg-3">
                    <a href="https://laboiteadons.org" className="h4 text-light">La Boîte à Dons</a>
                </div>
                
                <div className="col-7 col-lg-6">
                    <Nav className="flex-column">
                        <NavItem><a href="https://github.com/laboiteadons" className="nav-link" target="_blank" rel="noreferrer noopener">{t('Code')}</a></NavItem>
                        <NavItem><a href="https://gitter.im/laboiteadons/community" className="nav-link" target="_blank" rel="noreferrer noopener">{t('Community')}</a></NavItem>
                        <NavItem><a href="https://organigr.am/org/laboiteadons" className="nav-link" target="_blank" rel="noreferrer noopener">{t('Governance')}</a></NavItem>
                        <NavItem><a href="https://github.com/laboiteadons/laboiteadons/wiki" className="nav-link" target="_blank" rel="noreferrer noopener">{t('Wiki')}</a></NavItem>
                    </Nav>
                </div>
                
                <div className="col-5 col-lg-3">
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
                { code: 'en', name: "English" },
                { code: 'fr', name: "Français" }
            ].map(lang => <option value={lang.code} key={lang.code}>{lang.name}</option>)
        }
        </select>
    )
}