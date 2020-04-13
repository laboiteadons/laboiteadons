import React from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron, Row, Col } from 'reactstrap'
import { useTranslation, Trans } from 'react-i18next'

export const FrontPage = () => {
    const { t } = useTranslation()
    return (
        <>
            <Jumbotron>
                <Row>
                    <Col className="col-12 col-lg-6">
                        <h2>{t('Donations 3.0 for modern causes')}</h2>
                        <p className="lead d-none d-lg-block">
                            <Trans>
                                Now you can easily track and distribute your donations to multiple causes.<br/>
                                Transfers are cheap, instantaneous, highly secured and transparent on the <Link to="/about/blockchain">Ethereum Blockchain</Link>.<br/>
                                The app <Link to="/about/governance">doesn't need any central authority</Link> and is <Link to="/about/hosting">resistant against tampering</Link>, so you can stay in total control of your data.
                            </Trans>
                        </p>
                    </Col>
                    <Col className="col-12 col-lg-6">
                        <img src="/images/undraw_online_wishes_dlmr.png" alt="" className="img-fluid" />
                    </Col>
                </Row>
            </Jumbotron>
            <div className="my-5 text-center">
                <Link to="/donate" className="btn btn-primary btn-lg">{t('Start donating')}</Link>
            </div>
            <div className="my-5 text-center">
                <h3>{t('How does it work?')}</h3>
                <p>
                    <Trans>
                        Instead of donating once a year to one specific cause, you can distribute your donation to any number of causes. Thanks to the Ethereum blockchain, your donations are transparent, secured and do not need any third-party. Peer-to-peer hosting on IPFS ables you to visit this exact website without fear of tampering or censorship. The governance with Organigr.am ables many people to manage an organization, without the need for mutual trust. There is no central authority present to control your donations, or dictating you what causes to give to, the whole system is free, transparent, democratic and verifiable.
                    </Trans>
                </p>
                <Link to="/about" className="btn btn-secondary">{t('Learn more')}</Link>
            </div>
        </>
    )
}

export default FrontPage