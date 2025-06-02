import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import AdminPanel from './components/Admin/AdminPanel';
import Navbar from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

import SampleList from './components/Samples/SampleList';
import AddSample from './components/Samples/AddSample';
import SampleDetails from './components/Samples/SampleDetails';

import PatientList from './components/Patients/PatientList';
import AddPatient from './components/Patients/AddPatient';
import EditPatient from './components/Patients/EditPatient';
import PatientDetails from './components/Patients/PatientDetails';
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import './styles/main.css';

function App() {
  // ✅ Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    
  };

  return ( <AuthProvider>
    <Router>
      {user && <Navbar user={user} setUser={setUser} handleLogout={handleLogout} />}
      <div className={user ? 'app-layout' : ''}>
        {user ? (
          <div className="layout-flex">
            <Sidebar user={user} />
            <div className="main-content">
              <Routes>
                {/* Default route */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<Dashboard user={user} />} />

                <Route path="/samples" element={<SampleList />} />
                <Route path="/samples/add" element={<AddSample />} />
                <Route path="/samples/:id" element={<SampleDetails />} />

                <Route path="/patients" element={<PatientList />} />
                <Route path="/patients/add" element={<AddPatient />} />
                <Route path="/patients/edit/:id" element={<EditPatient />} />
                <Route path="/patients/:id" element={<PatientDetails />} />

                <Route
                  path="/admin"
                  element={
                    user?.role === 'admin' ? (
                      <AdminPanel user={user} />
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />

                {/* Fallback for unknown routes */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        ) : (
          <div className="main-content">
            <Routes>
              {/* Show login if not authenticated */}
              <Route
                path="/"
                element={<Login setUser={(userData) => {
                  setUser(userData);
                  localStorage.setItem('user', JSON.stringify(userData));
                }} />}
              />
              {/* Redirect all other routes to login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
