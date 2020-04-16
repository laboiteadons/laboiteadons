import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Container } from 'reactstrap'
import { Web3Provider } from './ethereum'
import { DAppProvider } from './dapp'
import { I18nProvider } from './i18n'
import DonationPage from './pages/donation'
import { Header } from './components/header'
import Footer from './components/footer'

const App = () => (
    <Suspense fallback="">
        <I18nProvider>
            <Web3Provider>
                <DAppProvider>
                    <div className="flex-shrink-0">
                        <Header />
                        <Container>
                            <div className="mt-3 mb-5">
                                <DonationPage />
                            </div>
                        </Container>
                    </div>
                    <div className="footer mt-auto bg-dark text-primary">
                        <Footer />
                    </div>
                </DAppProvider>
            </Web3Provider>
        </I18nProvider>
    </Suspense>
)
    
ReactDOM.render(<App />, document.getElementById('root'))