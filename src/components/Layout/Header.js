import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/header.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="custom-header">
      <div className="header-brand">
        <span className="lims-logo">🧪</span>
        <span className="lims-title">LIMS Application</span>
      </div>
      <div className="header-right">
        {user ? (
          <>
            <span className="header-user">Hello, <b>{user.username}</b></span>
            <button className="header-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <span className="header-user">Hello, Guest</span>
        )}
      </div>
    </header>
  );
};

export default Navbar;