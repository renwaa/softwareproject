import 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheets/auth.css'; // Your custom styles

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
let backend_url = "http://localhost:3000/api/v1";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [successMessage, setSucessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_url}/login`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      
      const { status, data } = response;

      if (status === 200) {
        localStorage.setItem("userId",response.data.user._id);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("username", response.data.user.username);
        console.log("LOCAL STRORAGE" ,localStorage);
        if(response.data.user.mfaEnabled) {
           navigate(`/mfa`);
        } else {
          const authToken = data.token; 
          localStorage.setItem("authToken", authToken); 
          navigate(`/homepage`);

        }
    
      } else {
        setErrorMessage("Login failed");
      }
    } catch (error) {
      setErrorMessage("Can not login password or email are incorrect.");
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: 'white' }}>
      <div className="row">
        <div className="col-20 col-md-30 col-lg-40">
          <div className="card shadow">
            <div className="card-body p-5"> 
              <h2 className="card-title text-center mb-4">Login Account</h2>
              
              {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
  
              {/* Email and Password Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={handleOnChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={handleOnChange}
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary w-100">Login</button>
                </div>
                <p className="mt-3 text-center">
                  Don't have an account? <Link to="/register" className="link-primary">Signup</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
