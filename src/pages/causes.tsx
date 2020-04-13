import React from 'react'
import { Link } from 'react-router-dom'
import { Nav, NavItem, CardBody, Row, Card, CardTitle, CardFooter, Container, CardText, Alert } from 'reactstrap'
import { useDApp, translateCauseField } from '../dapp'
import { useWeb3 } from '../ethereum'
import { useTranslation } from 'react-i18next'

export const CausesPage = () => {
  const { t, i18n: { language } } = useTranslation()
  const { connected, loading: web3loading, networkId } = useWeb3()
  const { causes, loading, availableNetworkIds } = useDApp()
  return (
    <Container>
      <h2>{t('Causes')}</h2>
      { (web3loading || loading) && <Alert className="alert-info">{t('Loading...')}</Alert>}
      { !loading && !connected && <Alert className="alert-danger">{t('You are not connected to Ethereum.')} <Link to="/">{t('Get started with an Ethereum wallet.')}</Link></Alert> }
      { !loading && connected && !availableNetworkIds.find(i => i === networkId) && (
        <div className="alert alert-warning">
          {t('You are not connected to the correct Ethereum network. Try switching to Rinkeby Ethereum Test Network in the Wallet window.')}
        </div>
      ) }
      <Row>
        {
          causes && causes.map((cause, i) => (
            <div key={i} className="col-12 col-lg-6 col-xl-4">
              <Card>
                <CardBody>
                  <CardTitle>
                    <h3 className="mt-0 mb-1">{translateCauseField(cause, "name", language)}</h3>
                  </CardTitle>
                  <CardText>
                  {translateCauseField(cause, "description", language)}
                  </CardText>
                </CardBody>
                <CardFooter>
                  <Nav className="flex-horizontal">
                    <NavItem><a href={translateCauseField(cause, "website", language)} className="btn btn-sm btn-primary" rel="noopener noreferrer" target="_blank">{t('Website')}</a></NavItem>
                    <NavItem><a href={translateCauseField(cause, "wikipedia", language)} className="btn btn-sm btn-secondary" rel="noopener noreferrer" target="_blank">{t('Wikipedia')}</a></NavItem>
                    <NavItem><a href={translateCauseField(cause, "twitter", language)} className="btn btn-sm btn-secondary" rel="noopener noreferrer" target="_blank">{t('Twitter')}</a></NavItem>
                    <NavItem><a href={`https://rinkeby.etherscan.io/address/${cause.addr}`} className="btn btn-sm btn-secondary" rel="noopener noreferrer" target="_blank">{t('Wallet')}</a></NavItem>
                  </Nav>
                </CardFooter>
              </Card>
            </div>
          ))
        }
      </Row>
    </Container>
  )
}

export default CausesPage