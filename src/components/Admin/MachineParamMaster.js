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

export default function MachineParamMaster() {
  const [machines, setMachines] = useState([]);
  const [tests, setTests] = useState([]);
  const [machineParams, setMachineParams] = useState([]);
  const [newParam, setNewParam] = useState({ machineId: "", testId: "", parameter: "" });
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  const [editParamId, setEditParamId] = useState(null);
  const [editParamMachineId, setEditParamMachineId] = useState("");
  const [editParamTestId, setEditParamTestId] = useState("");
  const [editParamName, setEditParamName] = useState("");

  useEffect(() => {
    fetchMachines();
    fetchTests();
    fetchMachineParams();
  }, []);

  const fetchMachines = async () => {
    const res = await api.get("/masters/machines");
    setMachines(res.data);
  };
  const fetchTests = async () => {
    const res = await api.get("/masters/tests");
    setTests(res.data);
  };
  const fetchMachineParams = async () => {
    const res = await api.get("/masters/machine-params");
    setMachineParams(res.data);
  };

  const addMachineParam = async () => {
    if (!newParam.machineId || !newParam.testId || !newParam.parameter.trim()) {
      setAlert({ show: true, type: "error", msg: "All fields required." });
      return;
    }
    try {
      await api.post("/masters/machine-params", {
        machine: { id: newParam.machineId },
        test: { id: newParam.testId },
        parameter: newParam.parameter.trim()
      });
      setNewParam({ machineId: "", testId: "", parameter: "" });
      setAlert({ show: true, type: "success", msg: "Machine parameter added!" });
      fetchMachineParams();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error adding parameter." });
    }
  };

  const deleteMachineParam = async (id) => {
    try {
      await api.delete(`/masters/machine-params/${id}`);
      setAlert({ show: true, type: "success", msg: "Parameter deleted." });
      fetchMachineParams();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error deleting parameter." });
    }
  };

  const startEditParam = (mp) => {
    setEditParamId(mp.id || mp._id);
    setEditParamMachineId(mp.machine?.id || mp.machine?._id || "");
    setEditParamTestId(mp.test?.id || mp.test?._id || "");
    setEditParamName(mp.parameter || "");
  };
  const cancelEditParam = () => {
    setEditParamId(null); setEditParamMachineId(""); setEditParamTestId(""); setEditParamName("");
  };
  const saveEditParam = async (id) => {
    if (!editParamMachineId || !editParamTestId || !editParamName.trim()) {
      setAlert({ show: true, type: "error", msg: "All fields required." });
      return;
    }
    try {
      await api.put(`/masters/machine-params/${id}`, {
        machine: { id: editParamMachineId },
        test: { id: editParamTestId },
        parameter: editParamName.trim()
      });
      setAlert({ show: true, type: "success", msg: "Parameter updated!" });
      cancelEditParam();
      fetchMachineParams();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error updating parameter." });
    }
  };

  return (
    <section style={cardStyle}>
      <h3 style={{ marginBottom: 18, color: "#1953a8" }}>Machine Parameter Test Master</h3>
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
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <select value={newParam.machineId} onChange={e => setNewParam(p => ({ ...p, machineId: e.target.value }))} style={inputStyle}>
          <option value="">Select Machine</option>
          {machines.map((m) => <option key={m.id || m._id} value={m.id || m._id}>{m.name}</option>)}
        </select>
        <select value={newParam.testId} onChange={e => setNewParam(p => ({ ...p, testId: e.target.value }))} style={inputStyle}>
          <option value="">Select Test</option>
          {tests.map((t) => <option key={t.id || t._id} value={t.id || t._id}>{t.name || t.testName}</option>)}
        </select>
        <input value={newParam.parameter} onChange={e => setNewParam(p => ({ ...p, parameter: e.target.value }))} placeholder="Parameter Name" style={inputStyle} />
        <button onClick={addMachineParam} style={buttonStyle}><FaPlus /> Add</button>
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
              <th style={{ padding: "14px 10px" }}>Machine</th>
              <th style={{ padding: "14px 10px" }}>Test</th>
              <th style={{ padding: "14px 10px" }}>Parameter</th>
              <th style={{ padding: "14px 10px" }}></th>
            </tr>
          </thead>
          <tbody>
            {machineParams.map((mp, idx) => (
              <tr key={mp.id || mp._id} style={{ background: idx % 2 === 0 ? "#f9fbfd" : "#f5f7fa" }}>
                {editParamId === (mp.id || mp._id) ? (
                  <>
                    <td>
                      <select value={editParamMachineId} onChange={e => setEditParamMachineId(e.target.value)} style={inputStyle}>
                        <option value="">Select Machine</option>
                        {machines.map((m) => (
                          <option key={m.id || m._id} value={m.id || m._id}>{m.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select value={editParamTestId} onChange={e => setEditParamTestId(e.target.value)} style={inputStyle}>
                        <option value="">Select Test</option>
                        {tests.map((t) => (
                          <option key={t.id || t._id} value={t.id || t._id}>{t.name || t.testName}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input value={editParamName} onChange={e => setEditParamName(e.target.value)} style={inputStyle} />
                    </td>
                    <td>
                      <button onClick={() => saveEditParam(mp.id || mp._id)} style={{ ...buttonStyle, background: "#27ae60" }}>Save</button>
                      <button onClick={cancelEditParam} style={{ ...buttonStyle, background: "#b0b8c1", color: "#333" }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{mp.machine?.name || mp.machine}</td>
                    <td>{mp.test?.name || mp.test?.testName || mp.test}</td>
                    <td>{mp.parameter}</td>
                    <td>
                      <button onClick={() => startEditParam(mp)} style={{ ...buttonStyle, background: "#f1c40f", color: "#333" }}>Edit</button>
                      <button onClick={() => deleteMachineParam(mp.id || mp._id)} style={deleteBtnStyle} title="Delete"><FaTrashAlt /></button>
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