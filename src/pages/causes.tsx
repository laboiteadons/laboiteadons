import React from 'react'
import { useDApp } from '../dapp'
import { Nav, NavItem, CardBody, Row, Card, CardTitle, CardFooter, Container, CardText, Alert } from 'reactstrap'

export const CausesPage = () => {
  const { causes, loading } = useDApp()
  return (
    <Container>
      <h2>Causes</h2>
      { loading && <Alert className="alert-info">Loading...</Alert>}
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