import 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheets/auth.css'; // Your custom styles

import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavBar from "../components/navbar";
import axios from "axios";
let backend_url = "http://localhost:3000/api/v1";

const verify =() => {
const navigate = useNavigate();
const [inputValue, setInputValue] = useState({
    OTP: "",
  });
  const [successMessage, setSucessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { OTP } = inputValue;
  const handleOnChange = (e) => {
    const { OTP, value } = e.target;
    setInputValue((prevInput) => ({
      ...prevInput,
      [OTP]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_url}/VerifyResponse`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );

      const { status, data } = response;

      if (status === 200) {
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("role", response.data.user.role);
        setSucessMessage("Verification successful");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setErrorMessage("Verfication failed");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setInputValue({
      ...inputValue,
      OTP: "",
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
              type="OTP"
              name="OTP"
              value={OTP}
              placeholder="Enter your OTP"
              onChange={handleOnChange}
            />
          </div>
          <button type="submit">Submit</button>
          <span>
            {errorMessage} {successMessage}
          </span>
         
        </form>
      </div>
    </>
  );
};
export default verify;