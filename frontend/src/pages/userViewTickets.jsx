import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheets/tickets.css';
import AppNavBarUser from '../components/navbarUser';
import { useCustomization } from "../contexts/CustomizationContext";


const StarRating = ({ count, value, onChange }) => {
  const { customization, updateCustomization } = useCustomization();

  return (
    < div style={{ 
      backgroundColor: customization.backgroundColor, 
      color: customization.fontColor, 
      fontSize: `${customization.fontSize} px`,
      minHeight: '100vh'
  }}
  >
      {[...Array(count)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onChange(ratingValue)}
              style={{ display: 'none' }}
            />
            <span style={{ color: ratingValue <= value ? "#ffc107" : "#e4e5e9", cursor: "pointer" }}>
              ★
            </span>
          </label>
        );
      })}
    </div>
  );
};

const GetUserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [ratings, setRatings] = useState({});
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUserAndTickets = async () => {
      try {
        const userResponse = await axios.get(`/api/user/info`, { withCredentials: true });
        // setUser(userResponse.data); // Uncomment if you need to use this data
      } catch (error) {
        console.error('Error fetching user info:', error);
      }

      try {
        const ticketsResponse = await axios.get(`http://localhost:3000/api/v1/viewMyTickets/${userId}`, { withCredentials: true });
        if (ticketsResponse.status === 200 && Array.isArray(ticketsResponse.data.myTickets)) {
          setTickets(ticketsResponse.data.myTickets);
        } else {
          setError('Failed to fetch tickets. Please try again later.');
        }
      } catch (error) {
        setError('Error fetching tickets. Please try again later.');
      }
    };

    fetchUserAndTickets();
  }, [userId]);

  const getStatusBadge = (status) => {
    let badgeClass = "badge badge-status ";
    switch (status) {
      case 'open':
        badgeClass += "badge-open";
        break;
      case 'close':  // Ensure this matches the status string from your backend
        badgeClass += "badge-closed";
        break;
      case 'pending':
        badgeClass += "badge-pending";
        break;
      default:
        badgeClass += "";
    }
    return <span className={badgeClass}>{status}</span>;
  };

  const handleRatingChange = (ticketId, rating) => {
    setRatings({ ...ratings, [ticketId]: rating });
  };

  const rateAgent = async (ticketId, rating) => {
    if (!rating) {
      alert('Please select a rating.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/v1/user/rateagent/${ticketId}`, { rating: parseInt(rating) }, { withCredentials: true });
      if (response.status === 200) {
        alert('Rating submitted successfully');
        // Optionally update the state or UI here
      } else {
        alert('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <>
    <AppNavBarUser/>
    <div className="container mb-4 main-container">
      <div className="row">
      
        <div className="col-lg-4 pb-5">
          {/* ... Profile card and details ... */}
        </div>

        {/* Ticket Display Section */}
        <div className="col-lg-8 pb-5">
          <h2 className="tickets-header">Your Tickets</h2>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              {/* Table Head */}
              <thead className="thead-dark">
                <tr>
                  <th>Ticket ID</th>
                  <th>Priority</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="4">No tickets available.</td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket._id}>
                      <td>
                      <Link className="navi-link" to={`/tickets/${ticket._id}`}>
  {ticket._id}
</Link>

                      </td>
                      <td>{ticket.priority}</td>
                      <td>{ticket.type}</td>
                      <td>
                        {getStatusBadge(ticket.status)}
                        {ticket.status === 'close' && (
                          <div>
                            <StarRating
                              count={5}
                              value={ratings[ticket._id] || 0}
                              onChange={(rating) => handleRatingChange(ticket._id, rating)}
                            />
                            <button onClick={() => rateAgent(ticket._id, ratings[ticket._id])}>
                              Submit Rating
                            </button>
                          </div>
                        )}
                      </td>
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
    </>
  );
};

export default GetUserTickets;