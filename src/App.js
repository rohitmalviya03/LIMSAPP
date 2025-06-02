import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import AdminPanel from './components/Admin/AdminPanel';
import "./styles/main.css";
function App() {
  // This holds the logged-in user's info, including role
  // Example: { username: 'admin', role: 'admin' }
  const [user, setUser] = useState(null);

  return (
    <Router>


      <Routes>
        
        {/* Login page: always shown at '/' */}
        <Route path="/" element={<Login setUser={setUser} />} />

        {/* Dashboard: only accessible if logged in */}
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} /> : <Navigate to="/" replace />
          }
        />

        {/* Admin Panel: only accessible if logged in AND is admin */}
        <Route
          path="/admin"
          element={
            user && user.role === 'admin'
              ? <AdminPanel user={user} />
              : <Navigate to="/" replace />
          }
        />

        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;