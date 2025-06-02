import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

const Sidebar = () => (
  <aside className="custom-sidebar">
    <div className="sidebar-brand">
      <span className="lims-logo">🧪</span>
      <span className="lims-sidebar-title">LIMS</span>
    </div>
    <nav className="sidebar-nav">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        end
      >
        Dashboard
      </NavLink>
      <div className="sidebar-section">Samples</div>
      <NavLink
        to="/samples"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        end
      >
        All Samples
      </NavLink>
      <NavLink
        to="/samples/add"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        end
      >
        Add Sample
      </NavLink>
      <div className="sidebar-section">Patients</div>
      <NavLink
        to="/patients/add"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        end
      >
        Register Patient
      </NavLink>
      <NavLink
        to="/patients"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        end
      >
        View All Patients
      </NavLink>
      <div className="sidebar-section">Admin</div>
      <NavLink
        to="/admin"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        end
      >
        Admin Panel
      </NavLink>
      <div className="sidebar-section">Tests</div>
      <NavLink
        to="/tests"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        end
      >
        Test Raised
      </NavLink>
      {/* Billing Section */}
      <div className="sidebar-section">Billing</div>
      <NavLink
        to="/billing"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        end
      >
        Billing
      </NavLink>
    </nav>
  </aside>
);

export default Sidebar;