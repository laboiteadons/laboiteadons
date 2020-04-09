import React from 'react'
import { HashRouter, Switch, Route, Redirect, useLocation, Link } from 'react-router-dom'
import { Container, Alert } from 'reactstrap'
import FrontPage from './pages/front'
import AboutPage from './pages/about'
import { Header } from './components/header'
import Footer from './components/footer'
import DonationPage from './pages/donation'
import CausesPage from './pages/causes'

export const AppRouter = () => (
    <HashRouter>
        <RouterFix />
        <div className="flex-shrink-0">
            <Header />
            <Container className="py-5">
                <Alert color="secondary" className="mb-5">
                    This demo is for test purposes only. All data and donations are set on the Rinkeby Ethereum Test Network. No real currency is ever exchanged.<br/>
                    <Link to="/about" className="btn btn-link">Learn more about the purpose of this app.</Link>
                </Alert>
                <Switch>
                    <Route exact path="/" component={FrontPage} />
                    <Route exact path="/donate" component={DonationPage} />
                    <Route exact path="/causes" component={CausesPage} />
                    <Route path="/about" component={AboutPage} />
                    <Route path="/" render={() => <Redirect to="/" />} />
                </Switch>
            </Container>
        </div>
        <div className="footer mt-auto bg-dark text-primary">
            <Footer />
        </div>
    </HashRouter>
)

export default AppRouter

const RouterFix = () => {
    let { pathname } = useLocation()
    React.useEffect(() => {
        // Scroll to top on page change.
        window.scrollTo(0, 0)
    }, [pathname])
    return <></>
}