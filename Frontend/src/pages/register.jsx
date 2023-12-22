import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const backend_url = "http://localhost:3000/api/v1";
export default function Signup(){

  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    firstName: "",
    lastName : "",
    email: "",
    password: "",
    username: "",
    role:""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { firstName , lastName , email, password, username ,role   } = inputValue;

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
      console.log(error);
      setErrorMessage(error.message);
    }

    setInputValue({
      ...inputValue,
    firstName: "",
    lastName : "",
    email: "",
    password: "",
    username: "",
    role:""
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
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={lastName}
          placeholder="Enter your last name"
          onChange={handleOnChange}
        />
      </div>
      <div>
        <label htmlFor="role">Role</label>
        <select
          name="role"
          value={role}
          onChange={handleOnChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          {/* Add other role options as needed */}
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

}

//export default Signup;
