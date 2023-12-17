import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const backend_url = "http://localhost:3000/api/v1";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    firstName: "",
    secondName : "",
    email: "",
    password: "",
    username: "",
    mfaEnabled: false,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { firstName , secondName , email, password, username , mfaEnabled  } = inputValue;

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

      const { status, data } = response;
      if (status === 201) {
        setSuccessMessage("SignUp successful");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      console.error(error.response?.data); // Log the response data if available
      setErrorMessage(error.message);
    }

    setInputValue({
      ...inputValue,
    firstName: "",
    lastName : "",
    email: "",
    password: "",
    username: "",
    mfaEnabled: false,
    });
  };

  return (
    <div className="form_container">
      <h2>Signup Account</h2>
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
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
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
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            placeholder="Enter your first name"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="secondName">Second Name</label>
          <input
            type="text"
            name="secondName"
            value={secondName}
            placeholder="Enter your second name"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="mfaEnabled">Enable Multi-Factor Authentication</label>
          <select
            name="mfaEnabled"
            value={mfaEnabled}
            onChange={handleOnChange}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
        <button type="submit">Submit</button>
        <span>
          {errorMessage} {successMessage}
        </span>
        <span>
          Already have an account? <Link to={"/api/v1/login"}>Login</Link>
        </span>
      </form>
    </div>
  );
  
};

export default Signup;
