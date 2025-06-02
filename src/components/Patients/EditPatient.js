import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

const EditPatient = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    contact: "",
    email: "",
    address: "",
    idProof: "",
    mrn: "",
    emergencyContact: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/patients/${id}`).then(res => setForm(res.data)).catch(() => setError("Failed to load patient data"));
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/patients/${id}`, form);
      navigate("/patients");
    } catch {
      setError("Could not update patient. Please check form and try again.");
    }
  };

  return (
    <div className="patient-form-container">
      <h2>Edit Patient</h2>
      {error && <div className="patient-error">{error}</div>}
      <form className="patient-form" onSubmit={handleSubmit}>
        <div className="patient-form-grid">
          <div>
            <label>First Name:</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label>Last Name:</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <div>
            <label>Gender:</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select...</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label>Date of Birth:</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
          </div>
          <div>
            <label>Contact Number:</label>
            <input name="contact" value={form.contact} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label>Address:</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>
          <div>
            <label>ID Proof:</label>
            <input name="idProof" value={form.idProof} onChange={handleChange} />
          </div>
          <div>
            <label>MRN:</label>
            <input name="mrn" value={form.mrn} onChange={handleChange} />
          </div>
          <div>
            <label>Emergency Contact:</label>
            <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
          </div>
        </div>
        <button className="btn" type="submit">Update Patient</button>
      </form>
    </div>
  );
};

export default EditPatient;