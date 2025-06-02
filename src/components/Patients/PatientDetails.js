import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams, useNavigate, Link } from "react-router-dom";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/patients/${id}`)
      .then(res => setPatient(res.data))
      .catch(() => setPatient(null));
  }, [id]);

  if (!patient) return <p>Loading or patient not found.</p>;

  return (
    <div>
      <button className="btn" onClick={() => navigate("/patients")}>Back</button>
      <h2>Patient Details</h2>
      <div style={{marginTop: 20}}>
        <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>DOB:</strong> {patient.dob}</p>
        <p><strong>Contact:</strong> {patient.contact}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Address:</strong> {patient.address}</p>
        <p><strong>ID Proof:</strong> {patient.idProof}</p>
        <p><strong>MRN:</strong> {patient.mrn}</p>
        <p><strong>Emergency Contact:</strong> {patient.emergencyContact}</p>
        <p><strong>Status:</strong> {patient.status || "Active"}</p>
        <Link to={`/patients/edit/${patient.id}`} className="btn">Edit</Link>
      </div>
    </div>
  );
};

export default PatientDetails;