import React from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Card, CardBody, CardTitle, CardText, CardFooter, NavItem, Nav } from 'reactstrap'
import { useDApp, translateCauseField } from '../dapp'

export const CausesGrid = () => {
    const { t, i18n: { language } } = useTranslation()
    const { causes } = useDApp()
    return (
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
    )
}