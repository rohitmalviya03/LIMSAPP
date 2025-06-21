import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaUser, FaVenusMars, FaBirthdayCake, FaPhoneAlt, FaEnvelope,
  FaMapMarkerAlt, FaIdCard, FaHashtag, FaUserShield, FaHeartbeat
} from "react-icons/fa";
import "../../styles/patient-details.css";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  // Get labcode from localStorage
  const userStr = localStorage.getItem("user") || '{}';
  let obj = {};
  try {
    obj = JSON.parse(userStr);
  } catch (err) {
    obj = {};
  }
  const labcode = obj.labCode || "";

  useEffect(() => {
    if (!labcode) return;
    api.get(`/patients/${id}`, { params: { labcode } })
      .then(res => setPatient(res.data))
      .catch(() => setPatient(null));
  }, [id, labcode]);

  if (!patient) {
    return (
      <div className="patient-details-bg">
        <div className="patient-details-card fade-in">
          <p style={{ textAlign: "center", color: "#888", padding: 32 }}>Loading or patient not found.</p>
          <button className="btn-modern" onClick={() => navigate("/patients")}>Back to List</button>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-details-bg">
      <div className="patient-details-card fade-in">
        <div className="patient-details-header">
          <button className="btn-modern" onClick={() => navigate("/patients")}>← Back</button>
          <h2>
            <FaUser style={{ verticalAlign: "middle", marginRight: 8 }} /> Patient Details
          </h2>
        </div>
        <div className="patient-avatar-glow">
          <FaUser />
        </div>
        <div className="patient-details-info-modern">
          <div className="info-row">
            <span className="info-label"><FaUser className="icon" /> Name</span>
            <span className="info-value">{patient.firstName} {patient.lastName}</span>
          </div>
          <div className="info-row">
            <span className="info-label"><FaVenusMars className="icon" /> Gender</span>
            <span className="info-value">{patient.gender}</span>
          </div>
          <div className="info-row">
            <span className="info-label"><FaBirthdayCake className="icon" /> DOB</span>
            <span className="info-value">{patient.dob}</span>
          </div>
          <div className="info-row">
            <span className="info-label"><FaPhoneAlt className="icon" /> Contact</span>
            <span className="info-value">{patient.contact}</span>
          </div>
          <div className="info-row">
            <span className="info-label"><FaEnvelope className="icon" /> Email</span>
            <span className="info-value">{patient.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label"><FaMapMarkerAlt className="icon" /> Address</span>
            <span className="info-value">{patient.address}</span>
          </div>
          <div className="info-row">
            <span className="info-label"><FaIdCard className="icon" /> ID Proof</span>
            <span className="info-value">{patient.idProof}</span>
          </div>
          <div className="info-row">
            <span className="info-label"><FaHashtag className="icon" /> MRN</span>
            <span className="info-value">{patient.mrn}</span>
          </div>
          <div className="info-row">
            <span className="info-label"><FaUserShield className="icon" /> Emergency Contact</span>
            <span className="info-value">{patient.emergencyContact}</span>
          </div>
          <div className="info-row">
            <span className="info-label"><FaHeartbeat className="icon" /> Status</span>
            <span className="info-value">
              <span className={`status-pill-patient status-${(patient.status || "Active").toLowerCase()}`}>
                {patient.status || "Active"}
              </span>
            </span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link to={`/patients/edit/${patient.id}`} className="btn-modern">✏️ Edit Patient</Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;