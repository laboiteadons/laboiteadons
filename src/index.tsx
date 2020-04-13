import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './routes'
import { Web3Provider } from './ethereum'
import { DAppProvider } from './dapp'
import { I18nProvider } from './i18n'

const App = () => (
  <Suspense fallback="">
    <I18nProvider>
      <Web3Provider>
        <DAppProvider>
          <AppRouter />
        </DAppProvider>
      </Web3Provider>
    </I18nProvider>
  </Suspense>
)

ReactDOM.render(<App />, document.getElementById('root'))