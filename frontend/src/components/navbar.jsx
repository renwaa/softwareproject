import React from "react";
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AppNavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/homepage">
          Desk Help
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link text-white active" aria-current="page" href="faq">
                FAQ
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
               My Tickets
              </a>
            </li>

          </ul>
          {/* Additional items at the end */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                My Profile
              </a>
            </li>
            <li className="nav-item">
              <a href="notifications" >
              <FontAwesomeIcon icon={faBell} size="lg" style={{ paddingTop: '10px', color: 'white' }} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
