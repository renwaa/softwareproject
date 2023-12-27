import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../stylesheets/tickets.css';
import AppNavBarAdmin from '../components/navBarAdmin';
import { useCustomization } from "../contexts/CustomizationContext";


const TicketsPage = () => {
  const { customization, updateCustomization } = useCustomization();

  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ name: 'Loading...' });
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const username= localStorage.getItem("username");

  useEffect(() => {
    const fetchUserAndTickets = async () => {
      // Fetch user information
      try {
        const userResponse = await axios.get('/api/user/info', { withCredentials: true });
        setUser(userResponse.data); // Adjust according to your API response
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Handle error for user info fetch
      }

      // Fetch tickets
      try {
        const ticketsResponse = await axios.get('http://localhost:3000/api/v1/viewTickets', { withCredentials: true });
        if (ticketsResponse.status === 200 && Array.isArray(ticketsResponse.data.tickets)) {
          setTickets(ticketsResponse.data.tickets);
        } else {
          setError('Failed to fetch tickets. Please try again later.');
        }
      } catch (error) {
        setError('Error fetching tickets. Please try again later.');
      }
    };

    fetchUserAndTickets();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="badge badge-info">{status}</span>;
      case 'closed':
        return <span className="badge badge-success">{status}</span>;
      case 'pending':
        return <span className="badge badge-warning">{status}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    < div style={{ 
      backgroundColor: customization.backgroundColor, 
      color: customization.fontColor, 
      fontSize: `${customization.fontSize} px`,
      minHeight: '100vh'
  }}
  >
    <AppNavBarAdmin/>
    <div className="container mb-4 main-container">
      <div className="row">
        <div className="col-lg-4 pb-5">
          {/* Profile Sidebar */}
          <div className="author-card pb-3">
            <div className="author-card-cover backgroundColor">
            
            </div>
            <div className="author-card-profile">
              <div className="author-card-avatar">
                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="User Avatar" />
              </div>
              <div className="author-card-details">
                <h5 className="author-card-name text-lg">Name: {username}</h5>
                <h5 className="author-card-name text-lg"> Role : {role}</h5>

              </div>
            </div>
          </div>
          <div className="wizard">
            {/* Navigation items... */}
          </div>
        </div>

        {/* Tickets Table */}
        <div className="col-lg-8 pb-5">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th> Ticket Name</th>
                  <th>Ticket ID</th>
                  <th>Priority</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="4">No tickets available.</td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket._id}>
                      <td> {ticket.name}</td>
                      <td>
                        <Link className="navi-link" to={`/tickets/${ticket._id}`}>
                          {ticket._id}
                        </Link>
                      </td>
                      <td>{ticket.priority}</td>
                      <td>{ticket.type}</td>
                      <td>{getStatusBadge(ticket.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
        </div>
      </div>
    </div>
    </div>
  );
};

export default TicketsPage;
