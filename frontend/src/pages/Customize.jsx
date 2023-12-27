import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBarAdmin from '../components/navBarAdmin';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCustomization } from '../contexts/CustomizationContext';
const backend_url = 'http://localhost:3000/api/v1';

const Customize = () => {
  const { customization, updateCustomization } = useCustomization();
  const [inputValue, setInputValue] = useState({
    backgroundColor: '#ffffff',
    fontColor: '#000000',
    fontSize: 16,
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { backgroundColor, fontColor, fontSize } = inputValue;
  

  const fetchCustomizationData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/getCustomization`,
      { withCredentials: true } ,
     );
      console.log("1");
      const { customization } = response.data;
      console.log("2");
      setInputValue(customization);
      console.log("3");
    } catch (error) {
      console.error('Error fetching customization data:', error);
    }
  };

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
      const response = await axios.put(
        `${backend_url}/customize`,
       {...inputValue},
        { withCredentials: true },
      );
console.log(response.data)
      const { status,data } = response;

      if (status === 200) {
        setSuccessMessage('Customization successful');
        updateCustomization(data.customization);
        // Immediately fetch the updated customization data to reflect the changes
        fetchCustomizationData();
      } else {
        setErrorMessage('Customization failed');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div
      style={{
      backgroundColor: customization.backgroundColor,
      color: customization.fontColor,
      fontSize: `${customization.fontSize}px`,
      minHeight: '100vh'
    }}
  >
    
    <AppNavBarAdmin/>
    <div style={{ backgroundColor, color: fontColor, fontSize: `${fontSize}px`}}>
      <div className="form_container">
        <h2>Customization Page</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="backgroundColor">Background Color</label>
            <input
              type="text"
              name="backgroundColor"
              value={backgroundColor}
              placeholder="Enter background color"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <label htmlFor="fontColor">Font Color</label>
            <input
              type="text"
              name="fontColor"
              value={fontColor}
              placeholder="Enter font color"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <label htmlFor="fontSize">Font Size</label>
            <input
              type="number" // Change to number type
              name="fontSize"
              value={fontSize}
              placeholder="Enter font size"
              onChange={handleOnChange}
            />
          </div>

          <button type="submit">Submit</button>
          <span>
            {errorMessage} {successMessage}
          </span>
        </form>
      </div>

      {/* Display a preview with the applied styles */}
      <div style={{ backgroundColor, color: fontColor, fontSize: `${fontSize}px` }}>
        This is a preview with applied styles.
      </div>
     
      </div>
    </div>
    
  );
};

export default Customize;