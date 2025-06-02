import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <div className="sidebar">
    <h2>LIMS</h2>
    <NavLink to="/dashboard" end>Dashboard</NavLink>
    <NavLink to="/samples">Samples</NavLink>
    <NavLink to="/samples/add">Add Sample</NavLink>
    {/* Add more links for Inventory, Users, etc. */}
  </div>
);

export default Sidebar;