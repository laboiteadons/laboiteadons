import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './routes'
import { Web3Provider } from './ethereum'
import { DAppProvider } from './dapp'

const App = () => (
  <Web3Provider>
    <DAppProvider>
      <AppRouter />
    </DAppProvider>
  </Web3Provider>
)

ReactDOM.render(<App />, document.getElementById('root'))