import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Universal logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };



const getLabcode = () =>  {
  const userStr = localStorage.getItem("user") || '{}';
  try {
   
    let obj = {};
  try {
    obj = JSON.parse(userStr);
  } catch (err) {
    obj = { id: "rohitmalviya03" };
  }
    return obj.labCode || '';
  } catch {
    return '';
  }
}

  return (
    <AuthContext.Provider value={{ user, setUser, logout ,getLabcode}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);