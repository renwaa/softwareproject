import React from 'react';
import "../stylesheets/button.css"; // Use relative path to access the stylesheets directory

export default function BigButtonPage() {

  return (
    <div className="big-button-page">
    <div className="buttons-container">
      <a href="http://localhost:5173/tickets" className="support-button chat">
        <div className="button-content">
          <svg className="icon" viewBox="0 0 72 72">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="viewTickets"><path fill="currentColor" d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5a1.5 1.5 0 0 0 0 3a.5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5a1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5z"/></svg>              </svg>
          <div className="text-content">
            <h3>View Tickets </h3>
            <p>And generate their reports!</p>
          </div>
        </div>
      </a>
 
          <a href="http://localhost:5173/ViewReportsPage" className="support-button ticket">
            <div className="button-content">
              <svg className="icon" viewBox="0 0 72 72">
              <svg xmlns="http://www.w3.org/2000/svg" width="190" height="190" viewBox="0 0 60 60" id="view reports"><path fill= "currentColor" d= "M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m-2 11.5v-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5m-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z"></path></svg>              </svg>
              <div className="text-content">
                <h3>View Reports</h3>
                <p>Check all our reports now.</p>
              </div>
            </div>
          </a>

          <a href="http://localhost:5173/manager" className="support-button chat">
        <div className="button-content">
          <svg className="icon" viewBox="0 0 72 72">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="viewTickets"><path fill="currentColor" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/></svg>              </svg>
          <div className="text-content">
            <h3>View Analytics </h3>
            <p>All trending analytics</p>
          </div>
        </div>
      </a>





        </div>
      </div>
  );
}
