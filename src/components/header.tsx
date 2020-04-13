import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
    Collapse,
    Container,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem
} from 'reactstrap'
import { useTranslation } from 'react-i18next'

export const Header = React.memo(() => {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = React.useState(false)
    return (
        <Navbar color="secondary" dark expand="md">
            <Container>
                <NavbarBrand tag={Link} to="/">La Boîte à Dons</NavbarBrand>
                    <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink to="/donate" className="nav-link">{t('Donate')}</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/causes" className="nav-link">{t('Causes')}</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/about" className="nav-link">{t('About')}</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
            </Container>
        </Navbar>
    )
})