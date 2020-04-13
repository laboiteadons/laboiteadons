import React from 'react'
import { HashRouter, Switch, Route, Redirect, useLocation, Link } from 'react-router-dom'
import { Container, Alert } from 'reactstrap'
import { Trans, useTranslation } from 'react-i18next'
import FrontPage from './pages/front'
import AboutPage from './pages/about'
import { Header } from './components/header'
import Footer from './components/footer'
import DonationPage from './pages/donation'
import CausesPage from './pages/causes'

export const AppRouter = () => {
    const { t } = useTranslation()
    return (
        <HashRouter>
            <RouterFix />
            <div className="flex-shrink-0">
                <Header />
                <Container>
                    <Alert color="secondary" className="my-2">
                        <Trans t={t}>
                            This app is for test purposes only. No real currency is ever exchanged.<br/>
                            <Link to="/about" className="btn btn-link">Learn more about the purpose of this app</Link>
                        </Trans>
                    </Alert>
                    <div className="mt-3 mb-5">
                        <Switch>
                            <Route exact path="/" component={FrontPage} />
                            <Route exact path="/donate" component={DonationPage} />
                            <Route exact path="/causes" component={CausesPage} />
                            <Route path="/about" component={AboutPage} />
                            <Route path="/" render={() => <Redirect to="/" />} />
                        </Switch>
                    </div>
                </Container>
            </div>
            <div className="footer mt-auto bg-dark text-primary">
                <Footer />
            </div>
        </HashRouter>
    )
}

export default AppRouter

const RouterFix = () => {
    let { pathname } = useLocation()
    React.useEffect(() => {
        // Scroll to top on page change.
        window.scrollTo(0, 0)
    }, [pathname])
    return <></>
}