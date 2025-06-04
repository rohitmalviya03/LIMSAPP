import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaPlus, FaTimes } from "react-icons/fa";
import api from "../../api/api";

const TABS = [
  { key: "test", label: "Test Master" },
  { key: "sample", label: "Sample Master" },
  { key: "machine", label: "Machine Master" },
  { key: "machineparam", label: "Machine Parameter Test Master" }
];

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

export default function AdminPanel({ user }) {
  const [activeTab, setActiveTab] = useState("test");
  const [tests, setTests] = useState([]);
  const [samples, setSamples] = useState([]);
  const [machines, setMachines] = useState([]);
  const [machineParams, setMachineParams] = useState([]);
  const [newTest, setNewTest] = useState("");
  const [newTestPrice, setNewTestPrice] = useState("");
  const [newSample, setNewSample] = useState("");
  const [newMachine, setNewMachine] = useState("");
  const [newParam, setNewParam] = useState({ machineId: "", testId: "", parameter: "" });
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  // Edit states for all masters
  const [editTestId, setEditTestId] = useState(null);
  const [editTestName, setEditTestName] = useState("");
  const [editTestPrice, setEditTestPrice] = useState("");

  const [editSampleId, setEditSampleId] = useState(null);
  const [editSampleType, setEditSampleType] = useState("");

  const [editMachineId, setEditMachineId] = useState(null);
  const [editMachineName, setEditMachineName] = useState("");

  const [editParamId, setEditParamId] = useState(null);
  const [editParamMachineId, setEditParamMachineId] = useState("");
  const [editParamTestId, setEditParamTestId] = useState("");
  const [editParamName, setEditParamName] = useState("");

  // Fetch all master data on mount or tab change
  useEffect(() => {
    if (activeTab === "test") fetchTests();
    if (activeTab === "sample") fetchSamples();
    if (activeTab === "machine") fetchMachines();
    if (activeTab === "machineparam") {
      fetchMachines();
      fetchTests();
      fetchMachineParams();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  // Fetch functions
  const fetchTests = async () => {
    const res = await api.get("/masters/tests");
    setTests(res.data);
  };
  const fetchSamples = async () => {
    const res = await api.get("/masters/samples");
    setSamples(res.data);
  };
  const fetchMachines = async () => {
    const res = await api.get("/masters/machines");
    setMachines(res.data);
  };
  const fetchMachineParams = async () => {
    const res = await api.get("/masters/machine-params");
    setMachineParams(res.data);
  };

  // Add handlers with validation
  const addTest = async () => {
    if (!newTest.trim()) {
      setAlert({ show: true, type: "error", msg: "Test name is required." });
      return;
    }
    if (!newTestPrice || isNaN(newTestPrice) || Number(newTestPrice) < 0) {
      setAlert({ show: true, type: "error", msg: "Valid price is required." });
      return;
    }
    try {
      await api.post("/masters/tests", { testName: newTest.trim(), price: parseFloat(newTestPrice) });
      setNewTest("");
      setNewTestPrice("");
      setAlert({ show: true, type: "success", msg: "Test added successfully!" });
      fetchTests();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };

  const addSample = async () => {
    if (!newSample.trim()) {
      setAlert({ show: true, type: "error", msg: "Sample type is required." });
      return;
    }
    try {
      await api.post("/masters/samples", { type: newSample.trim() });
      setNewSample("");
      setAlert({ show: true, type: "success", msg: "Sample type added successfully!" });
      fetchSamples();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };

  const addMachine = async () => {
    if (!newMachine.trim()) {
      setAlert({ show: true, type: "error", msg: "Machine name is required." });
      return;
    }
    try {
      await api.post("/masters/machines", { name: newMachine.trim() });
      setNewMachine("");
      setAlert({ show: true, type: "success", msg: "Machine added successfully!" });
      fetchMachines();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };

  const addMachineParam = async () => {
    if (!newParam.machineId) {
      setAlert({ show: true, type: "error", msg: "Please select a machine." });
      return;
    }
    if (!newParam.testId) {
      setAlert({ show: true, type: "error", msg: "Please select a test." });
      return;
    }
    if (!newParam.parameter.trim()) {
      setAlert({ show: true, type: "error", msg: "Parameter name is required." });
      return;
    }
    try {
      await api.post("/masters/machine-params", {
        machine: { id: newParam.machineId },
        test: { id: newParam.testId },
        parameter: newParam.parameter.trim()
      });
      setNewParam({ machineId: "", testId: "", parameter: "" });
      setAlert({ show: true, type: "success", msg: "Machine parameter added successfully!" });
      fetchMachineParams();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };

  // Reset alert on input change
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (alert.show) setAlert({ ...alert, show: false });
  };
  const handleParamChange = (field) => (e) => {
    setNewParam(p => ({ ...p, [field]: e.target.value }));
    if (alert.show) setAlert({ ...alert, show: false });
  };

  // Delete handlers
  const deleteTest = async (id) => {
    try {
      await api.delete(`/masters/tests/${id}`);
      setAlert({ show: true, type: "success", msg: "Test deleted." });
      fetchTests();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };
  const deleteSample = async (id) => {
    try {
      await api.delete(`/masters/samples/${id}`);
      setAlert({ show: true, type: "success", msg: "Sample type deleted." });
      fetchSamples();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };
  const deleteMachine = async (id) => {
    try {
      await api.delete(`/masters/machines/${id}`);
      setAlert({ show: true, type: "success", msg: "Machine deleted." });
      fetchMachines();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };
  const deleteMachineParam = async (id) => {
    try {
      await api.delete(`/masters/machine-params/${id}`);
      setAlert({ show: true, type: "success", msg: "Machine parameter deleted." });
      fetchMachineParams();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };

  // Edit handlers for Test Master
  const startEditTest = (test) => {
    setEditTestId(test.id || test._id);
    setEditTestName(test.name || test.testName);
    setEditTestPrice(test.price);
    setAlert({ show: false, type: "success", msg: "" });
  };

  const cancelEditTest = () => {
    setEditTestId(null);
    setEditTestName("");
    setEditTestPrice("");
  };

  const saveEditTest = async (id) => {
    if (!editTestName.trim()) {
      setAlert({ show: true, type: "error", msg: "Test name is required." });
      return;
    }
    if (editTestPrice === "" || isNaN(editTestPrice) || Number(editTestPrice) < 0) {
      setAlert({ show: true, type: "error", msg: "Valid price is required." });
      return;
    }
    try {
      await api.put(`/masters/tests/${id}`, {
        testName: editTestName.trim(),
        price: parseFloat(editTestPrice)
      });
      setAlert({ show: true, type: "success", msg: "Test updated successfully!" });
      setEditTestId(null);
      setEditTestName("");
      setEditTestPrice("");
      fetchTests();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };

  // Edit handlers for Sample Master
  const startEditSample = (sample) => {
    setEditSampleId(sample.id || sample._id);
    setEditSampleType(sample.type);
    setAlert({ show: false, type: "success", msg: "" });
  };
  const cancelEditSample = () => {
    setEditSampleId(null);
    setEditSampleType("");
  };
  const saveEditSample = async (id) => {
    if (!editSampleType.trim()) {
      setAlert({ show: true, type: "error", msg: "Sample type is required." });
      return;
    }
    try {
      await api.put(`/masters/samples/${id}`, { type: editSampleType.trim() });
      setAlert({ show: true, type: "success", msg: "Sample updated successfully!" });
      setEditSampleId(null);
      setEditSampleType("");
      fetchSamples();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };

  // Edit handlers for Machine Master
  const startEditMachine = (machine) => {
    setEditMachineId(machine.id || machine._id);
    setEditMachineName(machine.name);
    setAlert({ show: false, type: "success", msg: "" });
  };
  const cancelEditMachine = () => {
    setEditMachineId(null);
    setEditMachineName("");
  };
  const saveEditMachine = async (id) => {
    if (!editMachineName.trim()) {
      setAlert({ show: true, type: "error", msg: "Machine name is required." });
      return;
    }
    try {
      await api.put(`/masters/machines/${id}`, { name: editMachineName.trim() });
      setAlert({ show: true, type: "success", msg: "Machine updated successfully!" });
      setEditMachineId(null);
      setEditMachineName("");
      fetchMachines();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };

  // Edit handlers for Machine Parameter Test Master
  const startEditParam = (param) => {
    setEditParamId(param.id || param._id);
    setEditParamMachineId(param.machine?.id || param.machine?._id || param.machine);
    setEditParamTestId(param.test?.id || param.test?._id || param.test);
    setEditParamName(param.parameter);
    setAlert({ show: false, type: "success", msg: "" });
  };
  const cancelEditParam = () => {
    setEditParamId(null);
    setEditParamMachineId("");
    setEditParamTestId("");
    setEditParamName("");
  };
  const saveEditParam = async (id) => {
    if (!editParamMachineId) {
      setAlert({ show: true, type: "error", msg: "Please select a machine." });
      return;
    }
    if (!editParamTestId) {
      setAlert({ show: true, type: "error", msg: "Please select a test." });
      return;
    }
    if (!editParamName.trim()) {
      setAlert({ show: true, type: "error", msg: "Parameter name is required." });
      return;
    }
    try {
      await api.put(`/masters/machine-params/${id}`, {
        machine: { id: editParamMachineId },
        test: { id: editParamTestId },
        parameter: editParamName.trim()
      });
      setAlert({ show: true, type: "success", msg: "Machine parameter updated successfully!" });
      setEditParamId(null);
      setEditParamMachineId("");
      setEditParamTestId("");
      setEditParamName("");
      fetchMachineParams();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        msg: "Something went wrong, please try again."
      });
    }
  };

  // Dismiss alert
  const dismissAlert = () => setAlert({ ...alert, show: false });

  // Theme variables
  const tableHeaderBg = "#f4f7fb";
  const tableHeaderColor = "#1953a8";
  const tableRowEven = "#f9fbfd";
  const tableRowOdd = "#f5f7fa";
  const tableRowHover = "#e3f0ff";
  const actionBtnGap = 10;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h2 style={{ marginBottom: 8, color: "#1953a8" }}>Admin Panel</h2>
      <div style={{ marginBottom: 18, color: "#1976d2", fontWeight: 500 }}>Welcome, {user?.username}!</div>

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
          <button onClick={dismissAlert} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 18 }}>
            <FaTimes />
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 22px",
              border: "none",
              borderBottom: activeTab === tab.key ? "3px solid #1976d2" : "3px solid transparent",
              background: "none",
              fontWeight: 700,
              color: activeTab === tab.key ? "#1976d2" : "#444",
              fontSize: 17,
              cursor: "pointer",
              transition: "color 0.2s"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Test Master */}
      {activeTab === "test" && (
        <section style={cardStyle}>
          <h3 style={{ marginBottom: 18, color: "#1953a8" }}>Test Master</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <input
              value={newTest}
              onChange={handleInputChange(setNewTest)}
              placeholder="Test Name"
              style={inputStyle}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={newTestPrice}
              onChange={handleInputChange(setNewTestPrice)}
              placeholder="Price"
              style={inputStyle}
            />
            <button onClick={addTest} style={buttonStyle}><FaPlus /> Add</button>
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
                  background: tableHeaderBg,
                  color: tableHeaderColor,
                  position: "sticky",
                  top: 0,
                  zIndex: 2
                }}>
                  <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: 700, fontSize: 17, borderBottom: "2px solid #e0e0e0" }}>Test Name</th>
                  <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: 700, fontSize: 17, borderBottom: "2px solid #e0e0e0" }}>Price</th>
                  <th style={{ padding: "16px 12px", borderBottom: "2px solid #e0e0e0", width: 180 }}></th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t, idx) => (
                  <tr
                    key={t.id || t._id}
                    style={{
                      background: idx % 2 === 0 ? tableRowEven : tableRowOdd,
                      transition: "background 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = tableRowHover}
                    onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? tableRowEven : tableRowOdd}
                  >
                    {editTestId === (t.id || t._id) ? (
                      <>
                        <td style={{ padding: "12px 10px" }}>
                          <input
                            value={editTestName}
                            onChange={e => setEditTestName(e.target.value)}
                            style={{ ...inputStyle, width: "90%" }}
                          />
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editTestPrice}
                            onChange={e => setEditTestPrice(e.target.value)}
                            style={{ ...inputStyle, width: "90%" }}
                          />
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <div style={{ display: "flex", gap: actionBtnGap }}>
                            <button
                              onClick={() => saveEditTest(t.id || t._id)}
                              style={{ ...buttonStyle, background: "#27ae60", fontSize: 15, padding: "7px 16px" }}
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditTest}
                              style={{ ...buttonStyle, background: "#b0b8c1", color: "#333", fontSize: 15, padding: "7px 16px" }}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "12px 10px" }}>{t.name || t.testName}</td>
                        <td style={{ padding: "12px 10px" }}>
                          {typeof t.price === "number" ? `₹${t.price.toFixed(2)}` : ""}
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <div style={{ display: "flex", gap: actionBtnGap }}>
                            <button
                              onClick={() => startEditTest(t)}
                              style={{ ...buttonStyle, background: "#f1c40f", color: "#333", fontSize: 15, padding: "7px 16px" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTest(t.id || t._id)}
                              style={{ ...buttonStyle, background: "#e74c3c", color: "#fff", fontSize: 15, padding: "7px 16px" }}
                              title="Delete"
                            >
                              <FaTrashAlt style={{ marginRight: 4 }} /> Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Sample Master */}
      {activeTab === "sample" && (
        <section style={cardStyle}>
          <h3 style={{ marginBottom: 18, color: "#1953a8" }}>Sample Master</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <input
              value={newSample}
              onChange={handleInputChange(setNewSample)}
              placeholder="Sample Type"
              style={inputStyle}
            />
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
                  background: tableHeaderBg,
                  color: tableHeaderColor,
                  position: "sticky",
                  top: 0,
                  zIndex: 2
                }}>
                  <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: 700, fontSize: 17, borderBottom: "2px solid #e0e0e0" }}>Sample Type</th>
                  <th style={{ padding: "16px 12px", borderBottom: "2px solid #e0e0e0" }}></th>
                </tr>
              </thead>
              <tbody>
                {samples.map((s, idx) => (
                  <tr
                    key={s.id || s._id}
                    style={{
                      background: idx % 2 === 0 ? tableRowEven : tableRowOdd,
                      transition: "background 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = tableRowHover}
                    onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? tableRowEven : tableRowOdd}
                  >
                    {editSampleId === (s.id || s._id) ? (
                      <>
                        <td style={{ padding: 8 }}>
                          <input
                            value={editSampleType}
                            onChange={e => setEditSampleType(e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        <td style={{ padding: 8, display: "flex", gap: 8 }}>
                          <button
                            onClick={() => saveEditSample(s.id || s._id)}
                            style={{ ...buttonStyle, background: "#27ae60" }}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditSample}
                            style={{ ...buttonStyle, background: "#b0b8c1", color: "#333" }}
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: 8 }}>{s.type}</td>
                        <td style={{ padding: 8, display: "flex", gap: 8 }}>
                          <button
                            onClick={() => startEditSample(s)}
                            style={{ ...buttonStyle, background: "#f1c40f", color: "#333" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSample(s.id || s._id)}
                            style={deleteBtnStyle}
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Machine Master */}
      {activeTab === "machine" && (
        <section style={cardStyle}>
          <h3 style={{ marginBottom: 18, color: "#1953a8" }}>Machine Master</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <input
              value={newMachine}
              onChange={handleInputChange(setNewMachine)}
              placeholder="Machine Name"
              style={inputStyle}
            />
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
                  background: tableHeaderBg,
                  color: tableHeaderColor,
                  position: "sticky",
                  top: 0,
                  zIndex: 2
                }}>
                  <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: 700, fontSize: 17, borderBottom: "2px solid #e0e0e0" }}>Machine Name</th>
                  <th style={{ padding: "16px 12px", borderBottom: "2px solid #e0e0e0" }}></th>
                </tr>
              </thead>
              <tbody>
                {machines.map((m, idx) => (
                  <tr
                    key={m.id || m._id}
                    style={{
                      background: idx % 2 === 0 ? tableRowEven : tableRowOdd,
                      transition: "background 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = tableRowHover}
                    onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? tableRowEven : tableRowOdd}
                  >
                    {editMachineId === (m.id || m._id) ? (
                      <>
                        <td style={{ padding: 8 }}>
                          <input
                            value={editMachineName}
                            onChange={e => setEditMachineName(e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        <td style={{ padding: 8, display: "flex", gap: 8 }}>
                          <button
                            onClick={() => saveEditMachine(m.id || m._id)}
                            style={{ ...buttonStyle, background: "#27ae60" }}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditMachine}
                            style={{ ...buttonStyle, background: "#b0b8c1", color: "#333" }}
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: 8 }}>{m.name}</td>
                        <td style={{ padding: 8, display: "flex", gap: 8 }}>
                          <button
                            onClick={() => startEditMachine(m)}
                            style={{ ...buttonStyle, background: "#f1c40f", color: "#333" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMachine(m.id || m._id)}
                            style={deleteBtnStyle}
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Machine Parameter Test Master */}
      {activeTab === "machineparam" && (
        <section style={cardStyle}>
          <h3 style={{ marginBottom: 18, color: "#1953a8" }}>Machine Parameter Test Master</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <select
              value={newParam.machineId}
              onChange={handleParamChange("machineId")}
              style={inputStyle}
            >
              <option value="">Select Machine</option>
              {machines.map((m) => <option key={m.id || m._id} value={m.id || m._id}>{m.name}</option>)}
            </select>
            <select
              value={newParam.testId}
              onChange={handleParamChange("testId")}
              style={inputStyle}
            >
              <option value="">Select Test</option>
              {tests.map((t) => <option key={t.id || t._id} value={t.id || t._id}>{t.name || t.testName}</option>)}
            </select>
            <input
              value={newParam.parameter}
              onChange={handleParamChange("parameter")}
              placeholder="Parameter Name"
              style={inputStyle}
            />
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
                  background: tableHeaderBg,
                  color: tableHeaderColor,
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
                  <tr
                    key={mp.id || mp._id}
                    style={{
                      background: idx % 2 === 0 ? tableRowEven : tableRowOdd,
                      transition: "background 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = tableRowHover}
                    onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? tableRowEven : tableRowOdd}
                  >
                    {editParamId === (mp.id || mp._id) ? (
                      <>
                        <td style={{ padding: 8 }}>
                          <select
                            value={editParamMachineId}
                            onChange={e => setEditParamMachineId(e.target.value)}
                            style={inputStyle}
                          >
                            <option value="">Select Machine</option>
                            {machines.map((m) => (
                              <option key={m.id || m._id} value={m.id || m._id}>{m.name}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: 8 }}>
                          <select
                            value={editParamTestId}
                            onChange={e => setEditParamTestId(e.target.value)}
                            style={inputStyle}
                          >
                            <option value="">Select Test</option>
                            {tests.map((t) => (
                              <option key={t.id || t._id} value={t.id || t._id}>{t.name || t.testName}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: 8 }}>
                          <input
                            value={editParamName}
                            onChange={e => setEditParamName(e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        <td style={{ padding: 8, display: "flex", gap: 8 }}>
                          <button
                            onClick={() => saveEditParam(mp.id || mp._id)}
                            style={{ ...buttonStyle, background: "#27ae60" }}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditParam}
                            style={{ ...buttonStyle, background: "#b0b8c1", color: "#333" }}
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: 8 }}>{mp.machine?.name || mp.machine}</td>
                        <td style={{ padding: 8 }}>{mp.test?.name || mp.test?.testName || mp.test}</td>
                        <td style={{ padding: 8 }}>{mp.parameter}</td>
                        <td style={{ padding: 8, display: "flex", gap: 8 }}>
                          <button
                            onClick={() => startEditParam(mp)}
                            style={{ ...buttonStyle, background: "#f1c40f", color: "#333" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMachineParam(mp.id || mp._id)}
                            style={deleteBtnStyle}
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}