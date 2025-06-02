import React, { useEffect, useState } from "react";
import api from "../../api/api";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";
import "../../styles/dashboard.css";

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    samples: 0,
    users: 0,
    tests: 0,
    inventory: 0,
    patients: 0,
    testsBreakdown: { all: 0, pending: 0, completed: 0, running: 0 }
  });

  useEffect(() => {
    Promise.all([
      api.get("/samples/count").then(res => res.data).catch(() => 0),
      api.get("/users/count").then(res => res.data).catch(() => 0),
      api.get("/tests/count").then(res => res.data).catch(() => ({
        all: 0, pending: 0, completed: 0, running: 0
      })),
      api.get("/inventory/count").then(res => res.data).catch(() => 0),
      api.get("/patients/count").then(res => res.data).catch(() => 0),
    ]).then(([samples, users, testsBreakdown, inventory, patients]) => {
      setStats({
        samples,
        users,
        tests: testsBreakdown.all || 0,
        inventory,
        patients,
        testsBreakdown
      });
    });
  }, []);

  return (
    <div className="dashboard-container fade-in">
      <h1 className="dashboard-title">👋 Welcome to LIMS Dashboard</h1>
      <p className="dashboard-desc">
        Manage your laboratory and patient information with ease.
      </p>

      {/* Stat Cards */}
      <div className="dashboard-cards">
        <div className="card card-patients">
          <div className="card-icon">🧑‍⚕️</div>
          <div className="card-title">Total Patients</div>
          <div className="card-value">{stats.patients}</div>
        </div>
        <div className="card card-samples">
          <div className="card-icon">🧫</div>
          <div className="card-title">Total Samples</div>
          <div className="card-value">{stats.samples}</div>
        </div>
        <div className="card card-tests">
          <div className="card-icon">🧪</div>
          <div className="card-title">Total Tests</div>
          <div className="card-value">{stats.tests}</div>
        </div>
        <div className="card card-users">
          <div className="card-icon">👥</div>
          <div className="card-title">Total Users</div>
          <div className="card-value">{stats.users}</div>
        </div>
        <div className="card card-inventory">
          <div className="card-icon">📦</div>
          <div className="card-title">Inventory Items</div>
          <div className="card-value">{stats.inventory}</div>
        </div>
      </div>

      {/* Test Breakdown */}
      <div className="dashboard-test-breakdown fade-in">
        <h3 className="breakdown-title">Test Status Overview</h3>
        <div className="breakdown-cards">
          <div className="breakdown-pill pending">
            <span>⏳ Pending</span>
            <b>{stats.testsBreakdown.pending}</b>
          </div>
          <div className="breakdown-pill running">
            <span>🚦 Running</span>
            <b>{stats.testsBreakdown.running}</b>
          </div>
          <div className="breakdown-pill completed">
            <span>✅ Completed</span>
            <b>{stats.testsBreakdown.completed}</b>
          </div>
          <div className="breakdown-pill all">
            <span>📊 All</span>
            <b>{stats.testsBreakdown.all}</b>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <h3 className="quick-title">Quick Navigation</h3>
      <div className="quick-links">
        <Link to="/patients" className="quick-link">👨‍⚕️ View Patients</Link>
        <Link to="/patients/add" className="quick-link">➕ Register Patient</Link>
        <Link to="/samples" className="quick-link">🧫 View Samples</Link>
        <Link to="/samples/add" className="quick-link">➕ Add Sample</Link>
        <Link to="/inventory" className="quick-link">📦 Inventory</Link>
        <Link to="/users" className="quick-link">👥 User Management</Link>
      </div>
    </div>
  );
};

export default Dashboard;