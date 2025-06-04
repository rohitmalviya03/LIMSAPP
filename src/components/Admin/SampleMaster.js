import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaPlus, FaTimes } from "react-icons/fa";
import api from "../../api/api";

const cardStyle = {
  background: "#f9fbfd",
  borderRadius: 12,
  boxShadow: "0 2px 12px #e0e0e0",
  padding: 24,
  marginBottom: 28,
  marginTop: 8
};
const inputStyle = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1.5px solid #b0b8c1",
  fontSize: "1rem",
  background: "#fff"
};
const buttonStyle = {
  padding: "8px 18px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer"
};
const deleteBtnStyle = {
  background: "none",
  border: "none",
  color: "#e74c3c",
  cursor: "pointer",
  fontSize: 18,
  marginLeft: 10
};

export default function SampleMaster() {
  const [samples, setSamples] = useState([]);
  const [newSample, setNewSample] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  const [editSampleId, setEditSampleId] = useState(null);
  const [editSampleType, setEditSampleType] = useState("");

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    const res = await api.get("/masters/samples");
    setSamples(res.data);
  };

  const addSample = async () => {
    if (!newSample.trim()) {
      setAlert({ show: true, type: "error", msg: "Sample type required." });
      return;
    }
    try {
      await api.post("/masters/samples", { type: newSample.trim() });
      setNewSample("");
      setAlert({ show: true, type: "success", msg: "Sample added!" });
      fetchSamples();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error adding sample." });
    }
  };

  const deleteSample = async (id) => {
    try {
      await api.delete(`/masters/samples/${id}`);
      setAlert({ show: true, type: "success", msg: "Sample deleted." });
      fetchSamples();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error deleting sample." });
    }
  };

  const startEditSample = (s) => {
    setEditSampleId(s.id || s._id);
    setEditSampleType(s.type);
  };
  const cancelEditSample = () => {
    setEditSampleId(null); setEditSampleType("");
  };
  const saveEditSample = async (id) => {
    if (!editSampleType.trim()) {
      setAlert({ show: true, type: "error", msg: "Sample type required." });
      return;
    }
    try {
      await api.put(`/masters/samples/${id}`, { type: editSampleType.trim() });
      setAlert({ show: true, type: "success", msg: "Sample updated!" });
      cancelEditSample();
      fetchSamples();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error updating sample." });
    }
  };

  return (
    <section style={cardStyle}>
      <h3 style={{ marginBottom: 18, color: "#1953a8" }}>Sample Master</h3>
      {alert.show && (
        <div style={{
          background: alert.type === "error" ? "#ffeaea" : "#e6f9ed",
          color: alert.type === "error" ? "#c0392b" : "#197d4b",
          border: `1.5px solid ${alert.type === "error" ? "#e74c3c" : "#27ae60"}`,
          borderRadius: 8,
          padding: "12px 18px",
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 500,
          fontSize: 16
        }}>
          <span>{alert.msg}</span>
          <button onClick={() => setAlert({ ...alert, show: false })} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 18 }}>
            <FaTimes />
          </button>
        </div>
      )}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <input value={newSample} onChange={e => setNewSample(e.target.value)} placeholder="Sample Type" style={inputStyle} />
        <button onClick={addSample} style={buttonStyle}><FaPlus /> Add</button>
      </div>
      <div style={{
        overflowX: "auto",
        borderRadius: 14,
        boxShadow: "0 2px 16px #e0e0e0",
        background: "#fff",
        marginTop: 12
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          borderRadius: 14,
          overflow: "hidden",
          fontFamily: "inherit"
        }}>
          <thead>
            <tr style={{
              background: "#f4f7fb",
              color: "#1953a8",
              position: "sticky",
              top: 0,
              zIndex: 2
            }}>
              <th style={{ padding: "16px 12px" }}>Sample Type</th>
              <th style={{ padding: "16px 12px" }}></th>
            </tr>
          </thead>
          <tbody>
            {samples.map((s, idx) => (
              <tr key={s.id || s._id} style={{ background: idx % 2 === 0 ? "#f9fbfd" : "#f5f7fa" }}>
                {editSampleId === (s.id || s._id) ? (
                  <>
                    <td>
                      <input value={editSampleType} onChange={e => setEditSampleType(e.target.value)} style={inputStyle} />
                    </td>
                    <td>
                      <button onClick={() => saveEditSample(s.id || s._id)} style={{ ...buttonStyle, background: "#27ae60" }}>Save</button>
                      <button onClick={cancelEditSample} style={{ ...buttonStyle, background: "#b0b8c1", color: "#333" }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{s.type}</td>
                    <td>
                      <button onClick={() => startEditSample(s)} style={{ ...buttonStyle, background: "#f1c40f", color: "#333" }}>Edit</button>
                      <button onClick={() => deleteSample(s.id || s._id)} style={deleteBtnStyle} title="Delete"><FaTrashAlt /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}