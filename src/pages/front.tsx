import React from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron, Row, Col } from 'reactstrap'

export const FrontPage = () => (
    <>
        <Jumbotron>
            <Row>
                <Col className="col-12 col-lg-6">
                    <h2>Donations 3.0 for modern causes</h2>
                    <p className="lead d-none d-lg-block">
                        Now you can easily track and distribute your donations to multiple causes.<br/>
                        Transfers are cheap, instantaneous, highly secured and transparent on the <Link to="/about/blockchain">Ethereum Blockchain</Link>.<br/>
                        The app <Link to="/about/governance">doesn't need any central authority</Link> and is <Link to="/about/hosting">resistant against tampering</Link>, so you can stay in total control of your data.
                    </p>
                </Col>
                <Col className="col-12 col-lg-6">
                    <img src="/images/undraw_online_wishes_dlmr.png" alt="" className="img-fluid" />
                </Col>
            </Row>
        </Jumbotron>
        <div className="my-5 text-center">
            <Link to="/donate" className="btn btn-primary btn-lg">Start donating</Link>
        </div>
        <div className="my-5 text-center">
            <h3>How does it work?</h3>
            <p>
                Instead of donating once to one cause, you can distribute your donation to any number of causes.<br/>
                All donations are transparent and highly secured thanks to the Ethereum public blockchain.
            </p>
            <Link to="/about" className="btn btn-secondary">Learn more</Link>
        </div>
    </>
)
export default FrontPage