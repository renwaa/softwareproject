import 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheets/auth.css'; // Your custom styles
import React, { useState, useEffect } from "react";
import axios from "axios";
import '../stylesheets/SetRoleForm.css';
import { useCustomization } from "../contexts/CustomizationContext";

const backend_url = "http://localhost:3000/api/v1";

const SetRolePage = () => {
  const { customization, updateCustomization } = useCustomization();

  const [formData, setFormData] = useState({
    targetUserId: "",
    role: "", // Role input as text
    agentType: "", // Agent type input
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
      const dataToSend = formData.role === 'agent' ? { ...formData, role: formData.agentType } : formData;
      const response = await axios.put(`${backend_url}/setRole/${formData.targetUserId}`, dataToSend, {
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
    
 < div style={{ 
  backgroundColor: customization.backgroundColor, 
  color: customization.fontColor, 
  fontSize: `${customization.fontSize} px`,
  minHeight: '100vh'
  }}
  >
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
          <option value="manager">manager</option>
          <option value="admin">admin</option>
          <option value="agent">agent</option>
        </select>

        {formData.role === 'agent' && (
          <div>
            <label className="lb" htmlFor="agentType">Agent Type</label>
            <select
              required
              id="agentType"
              name="agentType"
              value={formData.agentType}
              onChange={handleInputChange}
              className="infos"
            >
              <option value="">Select Agent Type</option>
              <option value="agent1">agent 1</option>
              <option value="agent2">agent 2</option>
              <option value="agent3">agent 3</option>
            </select>
          </div>
        )}

        <div className="button-container">
          <button id="send" type="submit">Set Role</button>
          <button id="limpar" type="reset">Clear</button>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
    </div>
  );
};

export default SetRolePage;