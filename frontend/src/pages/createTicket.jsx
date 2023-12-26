
import 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheets/auth.css'; // Your custom styles

import React, { useState }from "react";
import { Link, useNavigate } from "react-router-dom";
import AppNavBar from "../components/navbar";
import axios from "axios";

const backend_url = "http://localhost:3000/api/v1";
const id = localStorage.getItem("userId");
console.log(id);
const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    name: "",
    type: "",
    subCategory: "",
        priority: "",
    });
    const [subCategories, setSubCategories] = useState([]);
    const [workflowModalVisible, setWorkflowModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [workflow , setWorkflow] = useState("");
    const { name, type, subCategory, priority } = inputValue;

    const fetchWorkflow = async (subCategory) => {
        try {
            console.log("sub: " , subCategory);
        const response = await axios.get(`${backend_url}/getWorkflow/${subCategory}`,    
            { withCredentials: true }
        );
        setWorkflow(response.data.workflow);
        setWorkflowModalVisible(true);

        } catch (error) {
        console.error("Error fetching workflow:", error);
           // Reset workflow in case of an error
        }
    };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));  

    if (name === "type") {
      updateSubCategories(value);
    }

     if ( name === "subCategory") {
        fetchWorkflow( value);
      }
  };

  const updateSubCategories = (type) => {
    let categories = [];
    if (type === "Hardware") {
      categories = ["Desktops", "Laptops", "Printers", "Servers", "NetworkingEquipment"];
    } else if (type === "Software") {
      categories = ["ApplicationSoftware", "CustomSoftware", "IntegrationIssues"];
    } else if (type === "Network") {
      categories = ["EmailIssues", "InternetConnectionProblems", "WebsiteErrors"];
    }
    setSubCategories(categories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_url}/createTicket`,
        {
          ...inputValue,
          userId : id,
        },
        { withCredentials: true }
      );

      const { status, data } = response;

      if (status === 201) {
        setSuccessMessage("Ticket created successfully");
        setSuccessModalVisible(true);
        // setTimeout(() => {
        //   navigate("/homepage");
        // }, 1000);
      } else {
        setErrorMessage("Ticket creation failed");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }

    setInputValue({
      name: "",
      type: "",
      subCategory: "",
      priority: "",
    });
  };

  const closeWorkflowModal = () => {
    setWorkflowModalVisible(false);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
    navigate("/homepage");
  };

  return (
    <>
      <AppNavBar />
      <div className="form_container">
        <h2>Create New Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Enter ticket name"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <label htmlFor="type">Type</label>
            <select name="type" value={type} onChange={handleOnChange}>
              <option value="">Select Type</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
            </select>
          </div>
          <div>
          <label htmlFor="subCategory">Subcategory</label>
        <select name="subCategory" value={subCategory} onChange={handleOnChange}>
          <option value="">Select Subcategory</option>
          {subCategories.map((subCategoryOption, index) => (
            <option key={index} value={subCategoryOption}>
              {subCategoryOption}
            </option>
          ))}
        </select>
          </div>
          <div>
            <label htmlFor="priority">Priority</label>
            <select name="priority" value={priority} onChange={handleOnChange}>
              <option value="">Select priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button type="submit">Submit</button>
          <span>
            {errorMessage} {successMessage}
          </span>
        </form>
      </div>

       {/* Workflow Modal */}
       {workflowModalVisible &&
       (
        <div className="notification">
          <div className="notification-header">
            <h3 className="notification-title">We have an instant Solution!</h3>
            <i className="fa fa-times notification-close"></i>
          </div>
          <div className="notification-container">
            <div className="notification-media">
              <i className="fa fa-thumbs-up notification-reaction"></i>
            </div>
            <div className="notification-content">
              <p className="notification-text">
                <strong>{workflow.customWorkflow}</strong>
              </p>
            </div>
            <span className="notification-status"></span>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalVisible && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeSuccessModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Ticket created successfully</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeSuccessModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default CreateTicketPage;