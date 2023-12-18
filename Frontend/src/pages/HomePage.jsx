// HomePage.jsx

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../stylesheets/HomePage.css'; 
import '../components/navbar'
import AppNavBar from '../components/navbar';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      <AppNavBar />
      <Container fluid className="home-container">
        <Row className="hero-section">
          <Col md={6} className="hero-content">
            <h1 className="welcome-message">Streamline Your Support Process with Our Helpdesk System</h1>
            <p className="subtext">
              Our aim is to Enhance communication, streamline ticketing processes, and provide a comprehensive knowledge base for quick problem resolution.
            </p>
            <Button variant="primary" style={{ width: '175px', height: '40px' }}>
              Get Started
            </Button>
          </Col>
          <Col md={6} className="hero-image">
            {/* Add your hero image here */}
          </Col>
        </Row>

        <Row className="features-section">
          <Col md={12} className="features-content">
            <h2>Key Features</h2>
            <ul>
              <li>Ticketing System with Categorization and Prioritization</li>
              <li>Knowledge Base with Organized FAQs and Solutions</li>
              <li>Communication Tools including Integrated Email, Notifications, and Real-Time Chat</li>
              <li>Reporting and Analytics for Managerial Insights</li>
              <li>Automation and Workflows for Efficiency</li>
              <li>Security Measures and Data Protection</li>
            </ul>
          </Col>
        </Row>

        <Row className="call-to-action">
          <Col md={6} className="cta-content">
            <h2>Ready to Transform Your Support System?</h2>
            <p>
              Join us in providing efficient support, enhancing communication, and delivering exceptional user experiences.
            </p>
            <Link to="/register" className="btn btn-primary" style={{ width: '175px', height: '40px' }}>
              Sign Up for Free
            </Link>
          </Col>
          <Col md={6} className="cta-image">
            {/* Add your call-to-action image here */}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
