import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

const LabEdit = () => {
  const { id: labId } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/lab/${labId}`)
      .then(res => setLab(res.data))
      .catch(() => setMessage("Failed to load lab details."));
  }, [labId]);

  const handleChange = e => setLab({ ...lab, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    try {
      await api.put(`/lab/${labId}`, lab);
      setMessage("Lab updated successfully.");
      setTimeout(() => navigate("/labmaster/list"), 1000);
    } catch {
      setMessage("Failed to update lab.");
    }
  };

  const handleCancel = () => {
    navigate("/labmaster/list");
  };

  if (!lab) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8, maxWidth: 400, margin: "20px auto" }}>
      <h3>Edit Lab</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input name="name" value={lab.name} onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </div>
        <div>
          <label>Code</label>
          <input name="code" value={lab.code} onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </div>
        <button type="submit" style={{ marginRight: 8 }}>Update</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
      {message && <div style={{ marginTop: 10, color: "#1976d2" }}>{message}</div>}
    </div>
  );
};

export default LabEdit;