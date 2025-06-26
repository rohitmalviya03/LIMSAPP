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
    <header className="modern-navbar themed-navbar">
      <div className="navbar-left" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        {/* <span className="lims-logo" role="img" aria-label="Lab" style={{ fontSize: 32, marginRight: 10 }}>
          🧪
        </span> */}
            <span className="lims-titles" style={{ fontWeight: 700, fontSize: 21, letterSpacing: "1px" }}>
          LabNexa - LIMS
        </span>
      </div>
      <nav className="navbar-links">
        <a href="/dashboard" className="navbar-link">Dashboard</a>
        <a href="/patients" className="navbar-link">Patients</a>
        <a href="/billing" className="navbar-link">Billing</a>
        <a href="/tests" className="navbar-link">Tests</a>
      </nav>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">
              <span className="user-icon" role="img" aria-label="user">👤</span>
              <b style={{ marginLeft: 6 }}>{user.username}</b>
            </span>
            <button className="navbar-logout-btn" onClick={handleLogout}>
              <span role="img" aria-label="logout" style={{ marginRight: 5 }}>🚪</span>
              Logout
            </button>
          </>
        ) : (
          <span className="navbar-user">Hello, Guest</span>
        )}
      </div>
    </header>
  );
};

export default Navbar;