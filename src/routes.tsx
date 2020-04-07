import React from 'react'
import { BrowserRouter, Switch, Route, Redirect, useLocation } from 'react-router-dom'
import { Container } from 'reactstrap'
import FrontPage from './pages/front'
import AboutPage from './pages/about'
import { Header } from './components/header'
import Footer from './components/footer'
import DonationPage from './pages/donation'
import CausesPage from './pages/causes'

export const AppRouter = () => (
    <BrowserRouter>
        <RouterFix />
        <div className="flex-shrink-0">
            <Header />
            <Container className="py-5">
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
    </BrowserRouter>
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