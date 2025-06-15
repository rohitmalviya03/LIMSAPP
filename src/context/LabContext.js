import React, { createContext, useContext, useState } from "react";

const LabContext = createContext();

export const LabProvider = ({ children }) => {
  // Default labcode can be set here or fetched from user profile
  const [labcode, setLabcode] = useState(null);

  return (
    <LabContext.Provider value={{ labcode, setLabcode }}>
      {children}
    </LabContext.Provider>
  );
};

export const useLab = () => useContext(LabContext);
