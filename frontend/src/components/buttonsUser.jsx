import React from 'react';
import "../stylesheets/button.css"; // Use relative path to access the stylesheets directory

export default function BigButtonPage() {

  return (
    <div className="big-button-page">
        <div className="buttons-container">
          <a href="http://localhost:5173/chat" className="support-button chat">
            <div className="button-content">
              <svg className="icon" viewBox="0 0 72 72">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="chat"><path d="M19,8H18V5a3,3,0,0,0-3-3H5A3,3,0,0,0,2,5V17a1,1,0,0,0,.62.92A.84.84,0,0,0,3,18a1,1,0,0,0,.71-.29l2.81-2.82H8v1.44a3,3,0,0,0,3,3h6.92l2.37,2.38A1,1,0,0,0,21,22a.84.84,0,0,0,.38-.08A1,1,0,0,0,22,21V11A3,3,0,0,0,19,8ZM8,11v1.89H6.11a1,1,0,0,0-.71.29L4,14.59V5A1,1,0,0,1,5,4H15a1,1,0,0,1,1,1V8H11A3,3,0,0,0,8,11Zm12,7.59-1-1a1,1,0,0,0-.71-.3H11a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1h8a1,1,0,0,1,1,1Z"></path></svg>              </svg>
              <div className="text-content">
                <h3>Chat with us </h3>
                <p>Need instant help? Chat live with one of our experts agents now!</p>
              </div>
            </div>
          </a>
          <a href="http://localhost:5173/createTicket" className="support-button ticket">
            <div className="button-content">
              <svg className="icon" viewBox="0 0 72 72">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" id="send"><path d="m50.625 12.073-42 17a1 1 0 0 0 .107 1.89l12.737 3.539 8.127 13.027a1.002 1.002 0 0 0 1.83-.338l1.777-9.123 11.801 4.244c.273.096.577.072.831-.072a.997.997 0 0 0 .488-.675l5.657-28.37a.999.999 0 0 0-1.355-1.122zM29.948 44.315l-6.424-10.297 16.2-8.726-8.081 10.844-.004.008c-.021.029-.028.065-.046.096a1 1 0 0 0-.121.282c-.002.007-.008.013-.01.02l-1.514 7.773zm14.64-4.279L34.054 36.25l9.97-13.379a1 1 0 0 0-1.275-1.478L21.991 32.57l-9.89-2.748 37.556-15.2-5.068 25.413z"></path></svg>              </svg>
              <div className="text-content">
                <h3>Create Ticket</h3>
                <p>Submit a ticket to the DeskHelp Support team.</p>
              </div>
            </div>
          </a>
        </div>
      </div>
  );
}
