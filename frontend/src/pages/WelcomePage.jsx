// HomePage.jsx

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../stylesheets/WelcomePage.css';
import AppNavBar from '../components/navbar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Tickets', Resolved: 1254, Active: 327 },
  // Add more data if necessary
];

// Define shades of blue for each bar or data key
const barColors = {
  Resolved: '#007bff', // Bootstrap primary blue
  Active: '#17a2b8', // Bootstrap info blue
  // Add more colors for different data keys if necessary
};


const WelcomePage = () => {
  const navigate = useNavigate();

  const redirectToSignup = () => {
    navigate("/register");
  };
  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <Container fluid className="home-container">
        <Row style={{ backgroundColor: '#f8f9fa' }}>
          <Col md={6}>
            <h2>Streamline Your Support Process with Our Helpdesk System</h2>
            <p>Our aim is to enhance communication, streamline ticketing processes, and provide a comprehensive knowledge base for quick problem resolution.</p>
            {/* <Button variant="outline-primary"style={{ fontSize: '16px', padding: '10px 50px' }} onClick={() => navigate('/get-started')}>Get Started</Button> */}
            {/* <Button className="btn" type="submit" style={{ borderColor: 'blue', color: 'blue' }} onClick={() => navigate('/get-started')}>Get Started</Button> */}
          </Col>
          <Col md={6}>
          <h2>Already have an account?</h2>
           <Button variant="outline-primary"style={{ fontSize: '16px', padding: '10px 50px' }} onClick= {redirectToLogin}>Login</Button>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
        <Col md={6}>
          <div>
        <h3>Website Statistics</h3>
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(barColors).map((key) => (
              <Bar key={key} dataKey={key} fill={barColors[key]} />
            ))}
          </BarChart>
          </div>
        </Col>
</Row>
        <Row style={{ backgroundColor: '#e9ecef' }}>
          <Col>
            <h2>Ready to Transform Your Support System?</h2>
            <p>Join us in providing efficient support, enhancing communication, and delivering exceptional user experiences.</p>
            <Button variant="outline-primary"style={{ fontSize: '16px', padding: '10px 50px' }} onClick={redirectToSignup }>Sign Up Now!</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WelcomePage;
