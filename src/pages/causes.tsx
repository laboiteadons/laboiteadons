import React from 'react'
import { Link } from 'react-router-dom'
import { Nav, NavItem, CardBody, Row, Card, CardTitle, CardFooter, Container, CardText, Alert } from 'reactstrap'
import { useDApp } from '../dapp'
import { useWeb3 } from '../ethereum'

export const CausesPage = () => {
  const { connected, loading: web3loading, networkId } = useWeb3()
  const { causes, loading, availableNetworkIds } = useDApp()
  return (
    <Container>
      <h2>Causes</h2>
      { (web3loading || loading) && <Alert className="alert-info">Loading...</Alert>}
      { !loading && !connected && <Alert className="alert-danger">You are not connected to Ethereum. <Link to="/">Get started with an Ethereum wallet.</Link></Alert> }
      { !loading && connected && !availableNetworkIds.find(i => i === networkId) && (
        <div className="alert alert-warning">
          You are not connected to the correct Ethereum network. Try switching to Rinkeby Ethereum Test Network in the Wallet window.
        </div>
      ) }
      <Row>
        {
          causes && causes.map((cause, i) => (
            <div key={i} className="col-4">
              <Card>
                <CardBody>
                  <CardTitle>
                    <h3 className="mt-0 mb-1">{cause.name}</h3>
                  </CardTitle>
                  <CardText>
                  {cause.description}
                  </CardText>
                </CardBody>
                <CardFooter>
                  <Nav className="flex-horizontal">
                    <NavItem><a href={cause.website} className="btn btn-sm btn-primary" rel="noopener noreferrer" target="_blank">Website</a></NavItem>
                    <NavItem><a href={cause.wikipedia} className="btn btn-sm btn-secondary" rel="noopener noreferrer" target="_blank">Wikipedia</a></NavItem>
                    <NavItem><a href={cause.twitter} className="btn btn-sm btn-secondary" rel="noopener noreferrer" target="_blank">Twitter</a></NavItem>
                    <NavItem><a href={`https://rinkeby.etherscan.io/address/${cause.addr}`} className="btn btn-sm btn-secondary" rel="noopener noreferrer" target="_blank">Wallet</a></NavItem>
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