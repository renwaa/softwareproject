import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppNavBarAdmin from '../components/navBarAdmin';
import { useCustomization } from "../contexts/CustomizationContext";


const RespondToTicket = () => {
  const { customization, updateCustomization } = useCustomization();

  const buttonStyle = {
    width: '100px',  // Adjust width as needed
    height: '50px',  // Adjust height as needed
    fontSize: '15px' // Adjust font size as needed
};
  const [solution, setSolution] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:3000/api/v1/agent/updateTicket/${id}`, {
        solution: solution,
      }, {
        withCredentials: true
      });
      setSuccessMessage('Ticket updated successfully');
      setError('');
    } catch (err) {
      setError('Error updating ticket');
      console.error(err);
      setSuccessMessage('');
    }
  };

  const textareaStyle = {
    width: '100%',
    height: '150px',
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
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Respond to Ticket</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="solution" className="form-label">Solution:</label>
                  <textarea
                    id="solution"
                    className="form-control"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    style={textareaStyle}
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary" style={buttonStyle}> Submit</button>
                </div>
              </form>
              {error && <p className="text-danger mt-3 text-center">{error}</p>}
              {successMessage && <p className="text-success mt-3 text-center">{successMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RespondToTicket;
