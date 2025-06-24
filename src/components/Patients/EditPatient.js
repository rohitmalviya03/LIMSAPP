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
  const userStr = localStorage.getItem("user") || '{"id":"rohitmalviya03"}';
  let obj = {};
  try {
    obj = JSON.parse(userStr);
  } catch (err) {
    obj = { id: "rohitmalviya03" };
  }
  useEffect(() => {
    api.get(`/patients/${id}?labcode=${obj.labCode}`).then(res => setForm(res.data)).catch(() => setError("Failed to load patient data"));
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
      <h2>Edit Patient Details</h2>
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
            <input name="contact" value={form.contact} onChange={handleChange}  maxLength={10}
    pattern="\d{10}"
    required
    placeholder="Enter 10 digit mobile number"
 />
          </div>
          <div>
            <label>Email:</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label>Address:</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>MRN</label>
            <input
              style={styles.input}
              name="mrn"
              value={form.mrn}
              readOnly
            />
          </div>
          <div>
            <label>Emergency Contact:</label>
            <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ID Proof Type</label>
            <select
              style={styles.input}
              name="idProofType"
              value={form.idProofType}
              onChange={handleChange}
              required
            >
              <option value="">Select ID Proof</option>
              <option value="Aadhar">Aadhar</option>
              <option value="PAN">PAN</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ID Proof Number</label>
            <input
              style={styles.input}
              name="idProof"
              value={form.idProof}
              onChange={handleChange}
              required
              placeholder="Enter selected ID proof number"
            />
          </div>
        </div>
        <button className="btn" type="submit">Update Patient</button>
      </form>
    </div>
  );
};

export default EditPatient;

const styles = {
  inputGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '.5rem',
  },
  input: {
    width: '100%',
    padding: '.5rem',
    borderRadius: '.25rem',
    border: '1px solid #ccc',
  },

  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fdfdfd',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '0.5rem',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#444',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.2s ease-in-out',
  },
  inputFocus: {
    borderColor: '#0077cc',
  },
  select: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: 'none',
    backgroundColor: '#fff',
  },
  mrnInput: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#f3f3f3',
    cursor: 'not-allowed',
  },
  formActions: {
    gridColumn: '1 / -1',
    marginTop: '2rem',
    textAlign: 'right',
  },
  btn: {
    backgroundColor: '#0077cc',
    color: '#fff',
    padding: '0.7rem 1.5rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  btnHover: {
    backgroundColor: '#005fa3',
  },


};