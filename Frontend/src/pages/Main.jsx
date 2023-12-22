// MainPage.jsx

import React from 'react';
import { Button, Container } from 'react-bootstrap';
import '../Main.css';

export default function MainPage() {
    return (
        <Container fluid className="main-page-container">
            <div className="button-group">
                <Button variant="primary" className="main-button">Create Ticket</Button>
                <Button variant="secondary" className="main-button">Ask a Question</Button>
                <Button variant="success" className="main-button">Track Ticket</Button>
            </div>
        </Container>
    );
}
