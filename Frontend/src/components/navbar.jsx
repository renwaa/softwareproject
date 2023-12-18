// Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, FormControl, Button } from 'react-bootstrap';

export default function AppNavBar() {
  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Software Helpdesk</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link active" aria-current="page">Home</Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-link">Login</Nav.Link>
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#">Action</NavDropdown.Item>
              <NavDropdown.Item href="#">Another action</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">Something else here</NavDropdown.Item>
            </NavDropdown> */}
            {/* <Nav.Link as={Link} to="/" className="nav-link disabled" aria-disabled="true">Disabled</Nav.Link> */}
          </Nav>
          <form className="d-flex"  >
            <FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" style={{ width: '200px' }} />
            <Button variant="outline-primary" style={{ width: '75px', height: '37px' }} type="submit">Search </Button>
          </form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
