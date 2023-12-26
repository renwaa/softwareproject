import 'bootstrap/dist/css/bootstrap.min.css';
  import '../stylesheets/auth.css'; // Your custom styles
  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import '../stylesheets/SetRoleForm.css'

  const backend_url = "http://localhost:3000/api/v1";

  const SetRolePage = () => {
    const [formData, setFormData] = useState({
      targetUserId: "",
      role: "", // Role input as text
    });
    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${backend_url}/getAllUsers`, {
            withCredentials: true,
          });
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }, []);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const response = await axios.put(`${backend_url}/setRole/${formData.targetUserId}`, formData, {
          withCredentials: true
        });
        setSuccessMessage(response.data.message);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.response.data.message || "Error setting role");
        setSuccessMessage("");
      }
    };

    return (
      
      <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <label className="lb" htmlFor="targetUserId">Select User</label>
        <select
          required
          id="targetUserId"
          name="targetUserId"
          value={formData.targetUserId}
          onChange={handleInputChange}
          className="infos" 
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
    
        <label className="lb" htmlFor="role">Role</label>
        <select
          required
          id="role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="infos"
        >
          <option value="">Select Role</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
          <option value="Agent 1">Agent 1</option>
          <option value="Agent 2">Agent 2</option>
          <option value="Agent 3">Agent 3</option>
        </select>
    
        <div className="button-container">
      <button id="send" type="submit">Set Role</button>
      <button id="limpar" type="reset">Clear</button>
    </div>

    {successMessage && <div className="success-message">{successMessage}</div>}
    {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
    );
  };

  export default SetRolePage;