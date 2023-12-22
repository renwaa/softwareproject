// WelcomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome to our Help Desk System</h1>
      <p>
        We provide solutions for software, hardware, and network problems. Streamline your support process with our helpdesk system.
      </p>

      {/* Navigation Bar */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login.jsx">Manager</Link>
          </li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </nav>

      {/* Updated Start Button */}
      <Link to="/HomePage" className="btn btn-primary">
        Start
      </Link>
    </div>
  );
};

export default WelcomePage;
