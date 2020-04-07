import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Nav, NavItem, Container } from 'reactstrap'

export const Footer = React.memo(() => {
  return (
    <Container className="py-5">
      <div className="row">
        <div className="col-4">
          <Link to="/" className="h4 text-light">La Boîte à Dons</Link>
        </div>

        <div className="col-4">
          <Nav className="flex-column">
            <NavItem><NavLink to="/" className="nav-link">Home</NavLink></NavItem>
            <NavItem><NavLink to="/donate" className="nav-link">Donate</NavLink></NavItem>
            <NavItem><NavLink to="/causes" className="nav-link">Causes</NavLink></NavItem>
            <NavItem><NavLink to="/about" className="nav-link">About</NavLink></NavItem>
          </Nav>
        </div>

        <div className="col-4">
          <Nav className="flex-column">
            <NavItem><a href="https://github.com/laboiteadons" className="nav-link">Github</a></NavItem>
            <NavItem><a href="https://twitter.com/laboiteadons" className="nav-link">Twitter</a></NavItem>
            <NavItem><a href="https://organigr.am/org/laboiteadons" className="nav-link">Organigr.am</a></NavItem>
          </Nav>
        </div>
      </div>
    </Container>
  )
})

export default Footer