// MFA.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppNavBar from "../components/navbar"; // Assuming you have a navigation bar component
import axios from "axios";
let backend_url = "http://localhost:3000/api/v1";

const MFA = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    mfaCode: "", // Assuming MFA code is entered here
  });
  const [successMessage, setSucessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { mfaCode } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem("userId");
    try {
      const response = await axios.post(
        `${backend_url}/mfa`, // Adjust the endpoint for MFA verification
        {
          mfaCode,
          id : id,
        },
        { withCredentials: true }
      );

      const { status, data } = response;

      if (status === 200) {
        setSucessMessage("MFA verification successful");
        // Redirect to another page after successful MFA verification
        navigate("/");
      } else {
        setErrorMessage("MFA verification failed");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setInputValue({
      ...inputValue,
      mfaCode: "",
    });
  };

  return (
    <>
      <AppNavBar /> {/* Include the navigation bar at the top of the MFA page */}
      <div className="form_container">
        <h2>MFA Verification</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="mfaCode">MFA Code</label>
            <input
              type="text"
              name="mfaCode"
              value={mfaCode}
              placeholder="Enter your MFA code"
              onChange={handleOnChange}
            />
          </div>
          <button type="submit">Submit</button>
          <span>
            {errorMessage} {successMessage}
          </span>
          <span>
            <Link to={"/login"}>Back to Login</Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default MFA;
