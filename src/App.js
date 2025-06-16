import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LabProvider } from "./context/LabContext";

import TestRaisedList from './components/TestRaised/TestRaisedList';
import AddTestRaised from './components/TestRaised/AddTestRaised';
import BillingModule from './components/Billing/BillingModule';
import TestRaisedDetails from './components/TestRaised/TestRaisedDetails';
import SampleCollectionList from './components/SampleCollection/SampleCollectionList';
import CollectedSamplesList from "./components/SampleCollection/CollectedSamplesList";
import ResultEntry from './components/ResultEntry/ResultEntry';
import ResultEntryList from "./components/ResultEntry/ResultEntryList";
import ResultValidationPage from './components/ResultEntry/ResultValidationPage';
import ReportSearchPage from './components/ResultEntry/ReportSearchPage';
import ReportPage from './components/ResultEntry/ReportPage';
import './styles/main.css';
import LabRegistrationForm from './components/LabMaster/LabRegistrationForm';
import LabAdminDashboard from './components/LabMaster/LabAdminDashboard';
function AppContent() {
  const { user, setUser } = useAuth();

  // Not logged in: show login page for all routes
  if (!user) {
    return (
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    );
  }

  // Admin: only show Navbar and AdminPanel, restrict all other routes
  if (user.role === 'admin') {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/admin" element={<AdminPanel user={user} />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </>
    );
  }

   if (user.role === 'labmaster') {
    return (
      <>
        <Navbar />
        <Routes>
              <Route path="/labmaster/add" element={<LabRegistrationForm />} />
                <Route path="*" element={<Navigate to="/labmaster/add" replace />} />
        </Routes>
      </>
    );
  }

  // // Result Entry role (or any role with access)
  // if (user.role === 'resultentry' || user.role === 'lab' || user.role === 'admin') {
  //   return (
  //     <>
  //       <Navbar />
  //       <Routes>
  //         <Route path="/result-entry" element={<ResultEntry />} />
  //         <Route path="*" element={<Navigate to="/result-entry" replace />} />
  //       </Routes>
  //     </>
  //   );
  // }

  // Non-admin: show Navbar, Sidebar, and all other routes except admin
  return (
    <>
      <Navbar />
      <div className="app-layout">
        <div className="layout-flex">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/samples" element={<SampleList />} />
               <Route path="/result-entry" element={<ResultEntry />} />
              <Route path="/samples/add" element={<AddSample />} />
              <Route path="/samples/:id" element={<SampleDetails />} />
              <Route path="/billing" element={<BillingModule />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patients/add" element={<AddPatient />} />
              <Route path="/patients/edit/:id" element={<EditPatient />} />
              <Route path="/patients/:id" element={<PatientDetails />} />
              <Route path="/sample-collection" element={<SampleCollectionList />} />
              <Route path="/samples/collected" element={<CollectedSamplesList />} />
              <Route path="/tests" element={<TestRaisedList />} />
              <Route path="/tests/add" element={<AddTestRaised />} />
              <Route path="/tests/:id" element={<TestRaisedDetails />} />
              <Route path="/results/entry" element={<ResultEntryList />} />
        
     <Route path="/labadmin/dashboard" element={<LabAdminDashboard />} />
  
              
                            <Route path="/results/pending-validation" element={<ResultValidationPage />} />
              <Route path="/results/report" element={<ReportSearchPage />} />
              <Route path="/results/report/view" element={<ReportPage />} />
             
              <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LabProvider>
        <Router>
          <AppContent />
        </Router>
      </LabProvider>
    </AuthProvider>
  );
}

export default App;