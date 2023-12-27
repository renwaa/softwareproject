import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCustomization } from "../contexts/CustomizationContext";

const backend_url = "http://localhost:3000/api/v1";

const Signup = () => {
  const { customization, updateCustomization } = useCustomization();

  const buttonStyle = {
    width: '100px',  // Adjust width as needed
    height: '50px',  // Adjust height as needed
    fontSize: '15px' // Adjust font size as needed
};
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    firstName: "",
    secondName: "",
    email: "",
    password: "",
    username: "",
    mfaEnabled: false,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { firstName, secondName, email, password, username, mfaEnabled } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_url}/register`,
        {
          ...inputValue,
          displayName: username,
          role: "user",
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setSuccessMessage("SignUp successful");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || error.message);
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
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="row">
        <div className="col-40 col-md-70 col-lg-100">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Signup Account</h2>
              {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
              {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input type="text" className="form-control" name="firstName" value={firstName} placeholder="Enter your first name" onChange={handleOnChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="secondName" className="form-label">Second Name</label>
                  <input type="text" className="form-control" name="secondName" value={secondName} placeholder="Enter your second name" onChange={handleOnChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" value={email} placeholder="Enter your email" onChange={handleOnChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input type="text" className="form-control" name="username" value={username} placeholder="Enter your username" onChange={handleOnChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" name="password" value={password} placeholder="Enter your password" onChange={handleOnChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="mfaEnabled" className="form-label">Enable Multi-Factor Authentication</label>
                  <select className="form-control" name="mfaEnabled" value={mfaEnabled} onChange={handleOnChange}>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary" style={buttonStyle}>Sign up </button>
                </div>
                <p className="mt-3 text-center">
                  Already have an account? <Link to="/login" className="link-primary">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Signup;