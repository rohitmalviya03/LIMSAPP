import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import SampleList from "./components/Samples/SampleList";
import AddSample from "./components/Samples/AddSample";
import SampleDetails from "./components/Samples/SampleDetails";
import Login from "./components/Auth/Login";
import Navbar from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import PatientList from "./components/Patients/PatientList";
import AddPatient from "./components/Patients/AddPatient";
import EditPatient from "./components/Patients/EditPatient";
import PatientDetails from "./components/Patients/PatientDetails";

const AppRoutes = () => (
  <Router>
    <div className="app-container">
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/samples" element={<SampleList />} />
            <Route path="/samples/add" element={<AddSample />} />
            <Route path="/samples/:id" element={<SampleDetails />} />

            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/add" element={<AddPatient />} />
            <Route path="/patients/edit/:id" element={<EditPatient />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            {/* Add more routes as you add features */}
          </Routes>
        </div>
      </div>
    </div>
  </Router>
);

export default AppRoutes;