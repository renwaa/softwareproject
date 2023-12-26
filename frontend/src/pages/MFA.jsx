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
        navigate("/homepage");
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
      <div className="container d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: 'white' }}>
      <div className="row">
        <div className="col-20 col-md-30 col-lg-40">
          <div className="card shadow">
            <div className="card-body p-5"> 
              <h2 className="card-title text-center mb-4">MFA Verification</h2>
              
              {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
              {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="mfaCode" className="form-label">MFA Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="mfaCode"
                    name="mfaCode"
                    value={mfaCode}
                    placeholder="Enter your MFA code"
                    onChange={handleOnChange}
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary w-100">Submit</button>
                </div>
              </form>
              <p className="mt-3 text-center">
                <Link to={"/login"} className="link-primary">Back to Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default MFA;
