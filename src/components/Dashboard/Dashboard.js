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
    testsBreakdown: { all: 0, pending: 0, completed: 0, running: 0 },
    samplesBreakdown: { all: 0, pending: 0, completed: 0, running: 0 }
  });

  console.log("Dashboard stats:", user, stats);

  useEffect(() => {
    Promise.all([
      api.get("/samples/count").then(res => res.data).catch(() => ({
        all: 0, pending: 0, completed: 0, running: 0, collected: 0, processing: 0
      })),
      api.get("/users/count").then(res => res.data).catch(() => 0),
      api.get("/tests/count").then(res => res.data).catch(() => ({
        all: 0, pending: 0, completed: 0, running: 0, collected: 0
      })),
      api.get("/inventory/count").then(res => res.data).catch(() => 0),
      api.get("/patients/count").then(res => res.data).catch(() => 0),
    ]).then(([samplesBreakdown, users, testsBreakdown, inventory, patients]) => {
      setStats({
        samples: samplesBreakdown.all || 0,
        users,
        tests: testsBreakdown.all || 0,
        inventory,
        patients,
        testsBreakdown,
        samplesBreakdown
      });
    });
  }, []);

  return (
    <div className="dashboard-main-bg">
      
      <div className="dashboard-container-modern fade-in">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">👋 Welcome, {user?.username || "User"}!</h1>
            <p className="dashboard-desc">
              Manage your laboratory and patient information with ease.
            </p>
          </div>
          <div className="dashboard-avatar">
            <span>{user?.username ? user.username[0].toUpperCase() : "U"}</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="dashboard-cards-modern">
          <div className="card-modern card-patients">
            <div className="card-modern-icon patients">🧑‍⚕️</div>
            <div className="card-modern-title">Patients</div>
            <div className="card-modern-value">{stats.patients}</div>
          </div>
          <div className="card-modern card-samples">
            <div className="card-modern-icon samples">🧫</div>
            <div className="card-modern-title">Samples</div>
            <div className="card-modern-value">{stats.samples}</div>
          </div>
          <div className="card-modern card-tests">
            <div className="card-modern-icon tests">🧪</div>
            <div className="card-modern-title">Tests</div>
            <div className="card-modern-value">{stats.tests}</div>
          </div>
          <div className="card-modern card-users">
            <div className="card-modern-icon users">👥</div>
            <div className="card-modern-title">Users</div>
            <div className="card-modern-value">{stats.users}</div>
          </div>
          <div className="card-modern card-inventory">
            <div className="card-modern-icon inventory">📦</div>
            <div className="card-modern-title">Inventory</div>
            <div className="card-modern-value">{stats.inventory}</div>
          </div>
        </div>

        {/* Test Breakdown */}
        <div className="dashboard-test-breakdown-modern fade-in">
          <h3 className="breakdown-title">Test Status Overview</h3>
          <div className="breakdown-pills-modern">
            <div className="breakdown-pill-modern pending">
              <span>⏳ Pending</span>
              <b>{stats.testsBreakdown.pending}</b>
            </div>
            <div className="breakdown-pill-modern running">
              <span>🚦 Running</span>
              <b>{stats.testsBreakdown.running}</b>
            </div>
            <div className="breakdown-pill-modern collected">
              <span>🧫 Collected</span>
              <b>{stats.testsBreakdown.collected || 0}</b>
            </div>
            <div className="breakdown-pill-modern completed">
              <span>✅ Completed</span>
              <b>{stats.testsBreakdown.completed}</b>
            </div>
            <div className="breakdown-pill-modern all">
              <span>📊 All</span>
              <b>{stats.testsBreakdown.all}</b>
            </div>
          </div>
        </div>

        {/* Sample Status Overview */}
        <div className="dashboard-test-breakdown-modern fade-in">
          <h3 className="breakdown-title">Sample Status Overview</h3>
          <div className="breakdown-pills-modern">
            <div className="breakdown-pill-modern pending">
              <span>⏳ Pending</span>
              <b>{stats.samplesBreakdown?.pending || 0}</b>
            </div>
            <div className="breakdown-pill-modern collected">
              <span>🧫 Collected</span>
              <b>{stats.samplesBreakdown?.collected || 0}</b>
            </div>
            <div className="breakdown-pill-modern processing">
              <span>🔄 Processing</span>
              <b>{stats.samplesBreakdown?.processing || 0}</b>
            </div>
            <div className="breakdown-pill-modern completed">
              <span>✅ Completed</span>
              <b>{stats.samplesBreakdown?.completed || 0}</b>
            </div>
            <div className="breakdown-pill-modern all">
              <span>📊 All</span>
              <b>{stats.samplesBreakdown?.all || 0}</b>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <h3 className="quick-title-modern">Quick Navigation</h3>
        <div className="quick-links-modern">
          <Link to="/patients" className="quick-link-modern">👨‍⚕️ View Patients</Link>
          <Link to="/patients/add" className="quick-link-modern">➕ Register Patient</Link>
          <Link to="/samples" className="quick-link-modern">🧫 View Samples</Link>
          <Link to="/samples/add" className="quick-link-modern">➕ Add Sample</Link>
          <Link to="/inventory" className="quick-link-modern">📦 Inventory</Link>
          <Link to="/users" className="quick-link-modern">👥 User Management</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;