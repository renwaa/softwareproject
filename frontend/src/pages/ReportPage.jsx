import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import '../stylesheets/Report.css';
import { useCustomization } from "../contexts/CustomizationContext";

const ReportPage = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const { state } = useLocation();

  useEffect(() => {
    const { customization, updateCustomization } = useCustomization();

    const fetchReportDetails = async () => {
      try {
        // Use reportId from useParams in the API call
       
        const response = await axios.get(`http://localhost:3000/api/v1/viewReport/${reportId}`, {
          withCredentials: true,
        });
        console.log(`http://localhost:3000/api/v1/viewReport/${reportId}`)
        console.log(response.data);

        if (response.status === 200) {
          setReport(response.data);
         
        } 
        else {
          console.error('Failed to fetch report details:', response.statusText);
          setError('Failed to fetch report details. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching report details:', error.message);
        setError('Error fetching report details. Please try again later.');
      }
      console.log(report);
     
      
    };

    fetchReportDetails();
  }, [reportId]); // Dependency array with reportId

  return (
    < div style={{ 
      backgroundColor: customization.backgroundColor, 
      color: customization.fontColor, 
      fontSize: `${customization.fontSize} px`,
      minHeight: '100vh'
  }}
  >
    <div className="container">
             <h2>Report Details</h2>

      {error ? (
        <p>{error}</p>
      ) : !report ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {/* Card for Ticket ID */}
          <div className="col-xl-6 col-lg-6">
            <div className="card l-bg-blue-dark">
              <div className="card-statistic-3 p-4">
                <div className="card-icon card-icon-large"><i className="fas fa-ticket-alt"></i></div>
                <div className="mb-4">
                  <h5 className="card-title mb-0">Ticket ID</h5>
                </div>
                <h2 className="d-flex align-items-center mb-0">
                  {report.ticketId}
                </h2>
              </div>
            </div>
          </div>

          {/* Card for Ticket Status */}
          <div className="col-xl-6 col-lg-6">
            <div className="card l-bg-blue-dark">
              <div className="card-statistic-3 p-4">
                <div className="card-icon card-icon-large"><i className="fas fa-users"></i></div>
                <div className="mb-4">
                  <h5 className="card-title mb-0">Ticket Status</h5>
                </div>
                <h2 className="d-flex align-items-center mb-0">
                  {report.ticketStatus}
                </h2>
              </div>
            </div>
          </div>

          

          {/* Card for Resolution Time */}
          <div className="col-xl-6 col-lg-6">
            <div className="card l-bg-blue-dark">
              <div className="card-statistic-3 p-4">
                <div className="card-icon card-icon-large"><i className="fas fa-clock"></i></div>
                <div className="mb-4">
                  <h5 className="card-title mb-0">Resolution Time</h5>
                </div>
                <h2 className="d-flex align-items-center mb-0">
                  {report.resolutionTime}
                </h2>
              </div>
            </div>
          </div>

         

          {/* Card for Agent Rating */}
          <div className="col-xl-6 col-lg-6">
            <div className="card l-bg-blue-dark">
              <div className="card-statistic-3 p-4">
                <div className="card-icon card-icon-large"><i className="fas fa-star"></i></div>
                <div className="mb-4">
                  <h5 className="card-title mb-0">Agent Rating</h5>
                </div>
                <h2 className="d-flex align-items-center mb-0">
                  {report.agentRating}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ReportPage;