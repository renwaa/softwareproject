import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AppNavBarAdmin from '../components/navBarAdmin';
import { useCustomization } from "../contexts/CustomizationContext";





const AgentTicketList = () => {
  const { customization, updateCustomization } = useCustomization();

  const buttonStyle = {
    width: '100px',  // Adjust width as needed
    height: '50px',  // Adjust height as needed
    fontSize: '15px' // Adjust font size as needed
};
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const agentId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/api/v1/agent/getAllTicketsForAgent/${agentId}`, { withCredentials: true });
        setTickets(response.data.tickets);
      } catch (err) {
        setError('Error fetching tickets');
        console.error(err);
      }
    };

    fetchTickets();
  }, []);

  const handleRespondClick = (ticketId) => {
    navigate(`/respond-to-ticket/${ticketId}`);
  };

  return (
    
 < div style={{ 
  backgroundColor: customization.backgroundColor, 
  color: customization.fontColor, 
  fontSize: `${customization.fontSize} px`,
  minHeight: '100vh'
  }}
  >
    <AppNavBarAdmin />
    <div className="container mt-5">
      <h2 className="mb-4">My Tickets</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Ticket ID</th>
            <th scope="col">Priority</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Subcategory</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={ticket._id}>
              <th scope="row">{index + 1}</th>
              <td>{ticket._id}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.type}</td>
              <td>{ticket.status}</td>
              <td>{ticket.subCategory}</td>
              <td>
                <button
                  className="btn btn-primary btn-lg custom-btn" // Add custom class
                  onClick={() => handleRespondClick(ticket._id)} style={buttonStyle}>Respond
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AgentTicketList;
