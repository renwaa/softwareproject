import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppNavBarUser from '../components/navbarUser';
import AppNavBarAdmin from '../components/navBarAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCustomization } from "../contexts/CustomizationContext";

const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");

const UpdateProfile = () => {
  const { customization, updateCustomization } = useCustomization();

    const buttonStyle = {
        width: '100px',  // Adjust width as needed
        height: '50px',  // Adjust height as needed
        fontSize: '15px' // Adjust font size as needed
    };
  const [user, setUser] = useState({
    firstName: '',
    secondName: '',
    email: '',
    username: '',
  });

  const fetchUser = async () => {

    try {
      const response= await axios.get(`http://localhost:3000/api/v1/user/getUserInfo/${userId}`, {
      withCredentials: true
    });


      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/api/v1/user/updateProfile/${userId}`, user, {
        withCredentials: true
    });

      console.log('User updated:', response.data);
      // Additional success handling
    } catch (error) {
      console.error('Error updating user:', error);
      // Error handling
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
  {
  role === "admin" ? (<AppNavBarAdmin />) :
  role === "user" ? (<AppNavBarUser />) :
  role === "manager" ? (<AppNavBarAdmin />) :
  role === "agent" ? (<AppNavBarAdmin />) :
  null
}

    <div className="container mt-5">
      <h2>Update Info:</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="firstName" 
            name="firstName" 
            value={user.firstName} 
            onChange={handleChange} 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="secondName" className="form-label">Second Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="secondName" 
            name="secondName" 
            value={user.secondName} 
            onChange={handleChange} 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            name="email" 
            value={user.email} 
            onChange={handleChange} 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input 
            type="text" 
            className="form-control" 
            id="username" 
            name="username" 
            value={user.username} 
            onChange={handleChange} 
          />
        </div>
        <button type="submit" className="btn btn-primary" style={buttonStyle}>Submit </button>
      </form>
    </div>
    </div>
  );
};

export default UpdateProfile;