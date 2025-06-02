import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="header">
      <span>LIMS Application</span>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 15 }}>Hello, {user.username}</span>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <span>Hello, Guest</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
