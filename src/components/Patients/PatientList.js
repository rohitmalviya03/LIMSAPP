import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/patients")
      .then(res => setPatients(res.data))
      .catch(() => setPatients([]));
  }, []);

  const filtered = patients.filter(
    p => (p.firstName + " " + p.lastName + " " + p.mrn + " " + p.contact)
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Patient Records</h2>
      <input
        placeholder="Search by name, MRN, contact"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{marginBottom: 12, padding: 6, width: 220}}
      />
      <Link to="/patients/add" className="btn" style={{marginLeft: 10}}>Add Patient</Link>
      <table className="table-custom">
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
          {filtered.map(patient => (
            <tr key={patient.id}>
              <td>{patient.mrn}</td>
              <td>{patient.firstName} {patient.lastName}</td>
              <td>{patient.gender}</td>
              <td>{patient.dob}</td>
              <td>{patient.contact}</td>
              <td>{patient.status || "Active"}</td>
              <td>
                <Link to={`/patients/${patient.id}`} className="btn">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;