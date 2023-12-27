// CustomizationContext.js

import React, { createContext, useContext, useState } from 'react';

const CustomizationContext = createContext();

export const useCustomization = () => {
  return useContext(CustomizationContext);
};

export const CustomizationProvider = ({ children }) => {
  const [customization, setCustomization] = useState(() => {
    // Retrieve initial state from local storage if available
    const savedCustomization = localStorage.getItem('customization');
    return savedCustomization ? JSON.parse(savedCustomization) : {
      backgroundColor: '#ffffff',
      fontColor: '#000000',
      fontSize: 16,
    };
  });

  const updateCustomization = (newCustomization) => {
    setCustomization(newCustomization);
    // Save to local storage
    localStorage.setItem('customization', JSON.stringify(newCustomization));
  };

  return (
    <CustomizationContext.Provider value={{ customization, updateCustomization }}>
      {children}
    </CustomizationContext.Provider>
  );
};