import React from "react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="header">
      <span>LIMS Application</span>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 15 }}>Hello, {user.username}</span>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <span>Guest</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;