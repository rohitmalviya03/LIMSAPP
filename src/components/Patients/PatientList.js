import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link, useLocation } from "react-router-dom";
import "../../styles/patient-list.css";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    api.get("/patients")
      .then(res => setPatients(res.data))
      .catch(() => setPatients([]));
  }, [location.key]); // refetch every time the route changes

  const filtered = patients.filter(
    p => (p.firstName + " " + p.lastName + " " + p.mrn + " " + p.contact)
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="patient-list-bg">
      <div className="patient-list-card fade-in">
        <div className="patient-list-header">
          <h2>🧑‍⚕️ Patient Records</h2>
          <div className="patient-list-actions">
            <input
              className="patient-list-search"
              placeholder="Search by name, MRN, contact"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Link to="/patients/add" className="btn-modern">+ Add Patient</Link>
          </div>
        </div>
        <div className="patient-table-responsive">
          <table className="patient-table-modern">
            <thead>
              <tr>
                <th>MRN</th>
                <th>Name</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#888", padding: 24 }}>
                    No patients found.
                  </td>
                </tr>
              ) : (
                filtered.map(patient => (
                  <tr key={patient.id}>
                    <td>{patient.mrn}</td>
                    <td>{patient.firstName} {patient.lastName}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.dob}</td>
                    <td>{patient.contact}</td>
                    <td>
                      <span className={`status-pill-patient status-${(patient.status || "Active").toLowerCase()}`}>
                        {patient.status || "Active"}
                      </span>
                    </td>
                    <td>
                      <Link to={`/patients/${patient.id}`} className="details-link-modern">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;