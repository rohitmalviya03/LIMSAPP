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

export default function MachineMaster() {
  const [machines, setMachines] = useState([]);
  const [newMachine, setNewMachine] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  const [editMachineId, setEditMachineId] = useState(null);
  const [editMachineName, setEditMachineName] = useState("");

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    const res = await api.get("/masters/machines");
    setMachines(res.data);
  };

  const addMachine = async () => {
    if (!newMachine.trim()) {
      setAlert({ show: true, type: "error", msg: "Machine name required." });
      return;
    }
    try {
      await api.post("/masters/machines", { name: newMachine.trim() });
      setNewMachine("");
      setAlert({ show: true, type: "success", msg: "Machine added!" });
      fetchMachines();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error adding machine." });
    }
  };

  const deleteMachine = async (id) => {
    try {
      await api.delete(`/masters/machines/${id}`);
      setAlert({ show: true, type: "success", msg: "Machine deleted." });
      fetchMachines();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error deleting machine." });
    }
  };

  const startEditMachine = (m) => {
    setEditMachineId(m.id || m._id);
    setEditMachineName(m.name);
  };
  const cancelEditMachine = () => {
    setEditMachineId(null); setEditMachineName("");
  };
  const saveEditMachine = async (id) => {
    if (!editMachineName.trim()) {
      setAlert({ show: true, type: "error", msg: "Machine name required." });
      return;
    }
    try {
      await api.put(`/masters/machines/${id}`, { name: editMachineName.trim() });
      setAlert({ show: true, type: "success", msg: "Machine updated!" });
      cancelEditMachine();
      fetchMachines();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error updating machine." });
    }
  };

  return (
    <section style={cardStyle}>
      <h3 style={{ marginBottom: 18, color: "#1953a8" }}>Machine Master</h3>
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
        <input value={newMachine} onChange={e => setNewMachine(e.target.value)} placeholder="Machine Name" style={inputStyle} />
        <button onClick={addMachine} style={buttonStyle}><FaPlus /> Add</button>
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
              <th style={{ padding: "16px 12px" }}>Machine Name</th>
              <th style={{ padding: "16px 12px" }}></th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m, idx) => (
              <tr key={m.id || m._id} style={{ background: idx % 2 === 0 ? "#f9fbfd" : "#f5f7fa" }}>
                {editMachineId === (m.id || m._id) ? (
                  <>
                    <td>
                      <input value={editMachineName} onChange={e => setEditMachineName(e.target.value)} style={inputStyle} />
                    </td>
                    <td>
                      <button onClick={() => saveEditMachine(m.id || m._id)} style={{ ...buttonStyle, background: "#27ae60" }}>Save</button>
                      <button onClick={cancelEditMachine} style={{ ...buttonStyle, background: "#b0b8c1", color: "#333" }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{m.name}</td>
                    <td>
                      <button onClick={() => startEditMachine(m)} style={{ ...buttonStyle, background: "#f1c40f", color: "#333" }}>Edit</button>
                      <button onClick={() => deleteMachine(m.id || m._id)} style={deleteBtnStyle} title="Delete"><FaTrashAlt /></button>
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