import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../stylesheets/tickets.css';
import { useCustomization } from "../contexts/CustomizationContext";

const TicketDetailsPage = () => {
  const { customization, updateCustomization } = useCustomization();
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [report, setReport] = useState({});
  const navigate = useNavigate();

  const generateAndNavigate = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/v1/generateReportPerTicket/${ticketId}`, null, {
        withCredentials: true,
      });

      const reportId = response.data._id;
      setReport(response.data);
      navigate(`/report/${reportId}`, { state: { report: response.data } });
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Error generating report. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/viewTicket/${ticketId}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setTicket(response.data.ticket);
        } else {
          console.error('Failed to fetch ticket details:', response.statusText);
          setError('Failed to fetch ticket details. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error.message);
        setError('Error fetching ticket details. Please try again later.');
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  return (
    < div style={{ 
      backgroundColor: customization.backgroundColor, 
      color: customization.fontColor, 
      fontSize: `${customization.fontSize} px`,
      minHeight: '100vh'
  }}
  >
    <div className="container">
      <h2>Ticket Details</h2>
      {error ? (
        <p>{error}</p>
      ) : !ticket ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="row horizontal-cards">
            {/* Ticket Information Card */}
            <div className="col-md-4">
              <div className="card m-b-30 card-box">
                <div className="card-header">
                  <h5 className="card-title mb-0">Details for ticket: {ticket?.name}</h5>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Priority: {ticket?.priority}</h5>
                  <h5 className="card-title">Type: {ticket?.type}</h5>
                  <h5 className="card-title">SubCategory: {ticket?.subCategory}</h5>
                  <h5 className="card-title">Status: {ticket?.status}</h5>
                </div>
              </div>
            </div>
          </div>

          {/* Button Container */}
          <div className="button-container">
            <button onClick={generateAndNavigate} className="btn btn-primary">
              Generate Report
            </button>
          </div>

          <div className="row horizontal-cards">
            {/* Ticket Description Card */}
            <div className="col-md-4">
              <div className="card m-b-30 card-box">
                <div className="card-header">
                  <h5 className="card-title mb-0">Ticket Description:</h5>
                </div>
                <div className="card-body">
                  <h5>{ticket?.Description}</h5>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default TicketDetailsPage;
