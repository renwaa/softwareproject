import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../stylesheets/AllReport.css';
import AppNavBarAdmin from '../components/navBarAdmin';
import { useCustomization } from "../contexts/CustomizationContext";


const ReportsPage = () => {
  const { customization, updateCustomization } = useCustomization();

  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/viewReports', { withCredentials: true });

        console.log('API response:', response);

        if (response.status === 200) {
          setReports(response.data);
          console.log('Reports set:', response.data);
        } else {
          console.error('Failed to fetch reports:', response.statusText);
          setError('Failed to fetch reports. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching reports:', error.message);
        setError('Error fetching reports. Please try again later.');
      }
    };

    fetchReports();
  }, []);

  return (
   
 < div style={{ 
  backgroundColor: customization.backgroundColor, 
  color: customization.fontColor, 
  fontSize: `${customization.fontSize} px`,
  minHeight: '100vh'
  }}
  >
    <AppNavBarAdmin/>
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#f8f9fa' }}> {/* Set a light background color */}
      <div className="container mt-3"> {/* Add a top margin for better spacing */}
        <h1>All Reports</h1>
        {error ? (
          <p className="text-danger">{error}</p> // Bootstrap class for error text
        ) : reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <ul className="list-group"> {/* Use list-group for better list styling */}
            {reports.map((report) => (
              <li key={report._id} className="list-group-item"> {/* list-group-item for each report */}
                <div><strong>Content:</strong> {report.content}</div>
                <div><strong>Ticket Status:</strong> {report.ticketStatus}</div>
                {report.agentRating && (
                  <div><strong>Agent Rating:</strong> {report.agentRating}</div>
                )}
                <hr />
                <Link to={`/report/${report._id}`}>
      <button 
        className="btn btn-primary"
        style={{ 
          fontSize: '18px', // Sets the font size of the button text
          padding: '10px 20px', // Adds padding inside the button to increase its size
          margin: '5px', // Adds margin around the button
          display: 'block', // Ensures the button is a block element to help with positioning
          width: '100%', // Makes the button extend full width of its parent container
          textAlign: 'center' // Centers the text inside the button
        }}
      >
        View Report
      </button>
    </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
};

export default ReportsPage;