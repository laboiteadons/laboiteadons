import React from 'react'
import {
    Container,
    Navbar,
    NavbarBrand,
    Alert
} from 'reactstrap'
import { Trans, useTranslation } from 'react-i18next'

export const Header = React.memo(() => {
    const { t } = useTranslation()
    return (
        <>
            <Navbar color="secondary" dark expand="md">
                <Container>
                    <NavbarBrand to="https://laboiteadons.org">La Boîte à Dons</NavbarBrand>
                </Container>
            </Navbar>
            <Alert color="warning">
                <Container>
                    <Trans t={t}>
                        This app is for test purposes only, no real currency is exchanged.&nbsp;
                        <a href="https://github.com/laboiteadons/laboiteadons/wiki" target="_blank" rel="noreferrer noopener">Discover the purpose of this app in the Wiki.</a>
                    </Trans>
                </Container>
            </Alert>
        </>
    )
})