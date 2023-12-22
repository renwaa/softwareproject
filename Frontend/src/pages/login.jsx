import 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheets/auth.css'; // Your custom styles

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppNavBar from "../components/navbar";
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
      const authToken = data.token; 
      localStorage.setItem("authToken", authToken); 
   
      if (status === 200) {
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("role", response.data.user.role);
        setSucessMessage("Login successful");
        setTimeout(() => {
          navigate('/Main');
          navigate("/");
        }, 1000);
      } else {
        setErrorMessage("Login failed");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };
  
  return (
    <>
      <AppNavBar /> {/* Include the navigation bar at the top of the Login page */}
      <div className="form_container">
        <h2>Login Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
          </div>
          <button type="submit">Submit</button>
          <span>
            {errorMessage} {successMessage}
          </span>
          <span>
            Already have an account? <Link to={"/signup"}>Signup</Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default Login;
