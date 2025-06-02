import React, { useEffect, useState } from "react";
import api from "../../api/api";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    samples: 0,
    users: 0,
    tests: 0,
    inventory: 0,
    patients: 0,
  });

  useEffect(() => {
    // Update with your actual backend endpoints!
    Promise.all([
      api.get("/samples/count").then(res => res.data).catch(() => 0),
      api.get("/users/count").then(res => res.data).catch(() => 0),
      api.get("/tests/count").then(res => res.data).catch(() => 0),
      api.get("/inventory/count").then(res => res.data).catch(() => 0),
      api.get("/patients/count").then(res => res.data).catch(() => 0),
    ]).then(([samples, users, tests, inventory, patients]) => {
      setStats({ samples, users, tests, inventory, patients });
    });
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 6 }}>Welcome to LIMS Dashboard</h1>
      <p style={{ color: "#444", marginBottom: 28 }}>
        Manage your laboratory and patient information with ease.
      </p>
      <div className="dashboard-cards">
        <div className="card">
          <div className="card-title">Total Patients</div>
          <div className="card-value">{stats.patients}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Samples</div>
          <div className="card-value">{stats.samples}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Tests</div>
          <div className="card-value">{stats.tests}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Users</div>
          <div className="card-value">{stats.users}</div>
        </div>
        <div className="card">
          <div className="card-title">Inventory Items</div>
          <div className="card-value">{stats.inventory}</div>
        </div>
      </div>
      <h3>Quick Navigation</h3>
      <div className="quick-links">
        <Link to="/patients" className="quick-link">View Patients</Link>
        <Link to="/patients/add" className="quick-link">Register Patient</Link>
        <Link to="/samples" className="quick-link">View Samples</Link>
        <Link to="/samples/add" className="quick-link">Add Sample</Link>
        <Link to="/inventory" className="quick-link">Inventory</Link>
        <Link to="/users" className="quick-link">User Management</Link>
      </div>
    </div>
  );
};

export default Dashboard;