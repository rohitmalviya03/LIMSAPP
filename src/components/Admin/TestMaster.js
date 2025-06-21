import React, { useEffect, useState } from "react";
import {
  FaTrashAlt, FaPlus, FaTimes, FaVial, FaRupeeSign, FaFlask, FaEdit, FaSave, FaBan
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

const cardStyle = {
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 4px 24px #1976d230",
  padding: 32,
  marginBottom: 32,
  marginTop: 24,
  maxWidth: 900,
  marginLeft: "auto",
  marginRight: "auto"
};
const inputStyle = {
  padding: "12px 16px",
  borderRadius: 8,
  border: "1.5px solid #b0b8c1",
  fontSize: "1rem",
  background: "#fafdff",
  marginRight: 8,
  minWidth: 120
};
const buttonStyle = {
  padding: "10px 24px",
  background: "linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  fontSize: 15,
  boxShadow: "0 2px 8px #1976d220",
  transition: "background 0.2s, box-shadow 0.2s"
};
const deleteBtnStyle = {
  background: "none",
  border: "none",
  color: "#e74c3c",
  cursor: "pointer",
  fontSize: 20,
  marginLeft: 10,
  transition: "color 0.2s"
};

export default function TestMaster() {
  const [tests, setTests] = useState([]);
  const [samples, setSamples] = useState([]);
  const [newTest, setNewTest] = useState("");
  const [newTestPrice, setNewTestPrice] = useState("");
  const [newTestSampleType, setNewTestSampleType] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  const [editTestId, setEditTestId] = useState(null);
  const [editTestName, setEditTestName] = useState("");
  const [editTestPrice, setEditTestPrice] = useState("");
  const [editTestSampleType, setEditTestSampleType] = useState("");

  const { user, logout } = useAuth();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    console.log("TestMaster - user:", storedUser);
    fetchTests();
    fetchSamples();
  }, []);

  const fetchTests = async () => {
    const res = await api.get("/masters/tests");
    setTests(res.data);
  };
  const fetchSamples = async () => {
    const res = await api.get("/masters/samples");
    setSamples(res.data);
  };

  const addTest = async () => {
    if (!newTest.trim() || !newTestSampleType || !newTestPrice) {
      setAlert({ show: true, type: "error", msg: "All fields required." });
      return;
    }
    console.log("user :"+user);
    try {
      await api.post("/masters/tests", {
        testName: newTest.trim(),
        price: parseFloat(newTestPrice),
        sampleType: newTestSampleType,
        labcode: user.username // Add labcode
      });
      setNewTest(""); setNewTestPrice(""); setNewTestSampleType("");
      setAlert({ show: true, type: "success", msg: "Test added!" });
      fetchTests();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error adding test." });
    }
  };

  const deleteTest = async (id) => {
    try {
      await api.delete(`/masters/tests/${id}`);
      setAlert({ show: true, type: "success", msg: "Test deleted." });
      fetchTests();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error deleting test." });
    }
  };

  const startEditTest = (t) => {
    setEditTestId(t.id || t._id);
    setEditTestName(t.name || t.testName);
    setEditTestPrice(t.price);
    setEditTestSampleType(t.sampleType || "");
  };
  const cancelEditTest = () => {
    setEditTestId(null); setEditTestName(""); setEditTestPrice(""); setEditTestSampleType("");
  };
  const saveEditTest = async (id) => {
    if (!editTestName.trim() || !editTestSampleType || editTestPrice === "") {
      setAlert({ show: true, type: "error", msg: "All fields required." });
      return;
    }
    try {
      await api.put(`/masters/tests/${id}`,
        {
          testName: editTestName.trim(),
          price: parseFloat(editTestPrice),
          sampleType: editTestSampleType,
          labcode: user.username // Add labcode
        }
      );
      setAlert({ show: true, type: "success", msg: "Test updated!" });
      cancelEditTest();
      fetchTests();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error updating test." });
    }
  };

  return (
    <section style={cardStyle}>
      <h3 style={{
        marginBottom: 22,
        color: "#1953a8",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 800,
        fontSize: "1.4rem"
      }}>
        <FaVial style={{ color: "#1976d2" }} /> Test Master
      </h3>
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
      <div style={{
        display: "flex",
        gap: 18,
        marginBottom: 26,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaVial style={{ color: "#1976d2" }} />
          <input value={newTest} onChange={e => setNewTest(e.target.value)} placeholder="Test Name" style={inputStyle} />
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaRupeeSign style={{ color: "#1976d2" }} />
          <input type="number" min="0" step="0.01" value={newTestPrice} onChange={e => setNewTestPrice(e.target.value)} placeholder="Price" style={inputStyle} />
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaFlask style={{ color: "#1976d2" }} />
          <select value={newTestSampleType} onChange={e => setNewTestSampleType(e.target.value)} style={inputStyle}>
            <option value="">Sample Type</option>
            {samples.map((s) => (
              <option key={s.id || s._id} value={s.type}>{s.type}</option>
            ))}
          </select>
        </span>
        <button onClick={addTest} style={{ ...buttonStyle, minWidth: 100 }} onMouseOver={e => e.currentTarget.style.background = '#1565c0'} onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)'}><FaPlus /> Add</button>
      </div>
      <div style={{
        overflowX: "auto",
        borderRadius: 16,
        boxShadow: "0 2px 16px #e0e0e0",
        background: "#fafdff",
        marginTop: 12
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          borderRadius: 16,
          overflow: "hidden",
          fontFamily: "inherit"
        }}>
          <thead>
            <tr style={{
              background: "#e3f0fc",
              color: "#1953a8",
              position: "sticky",
              top: 0,
              zIndex: 2,
              fontSize: 17
            }}>
              <th style={{ padding: "16px 12px" }}><FaVial style={{ verticalAlign: "middle" }} /> Test Name</th>
              <th style={{ padding: "16px 12px" }}><FaRupeeSign style={{ verticalAlign: "middle" }} /> Price</th>
              <th style={{ padding: "16px 12px" }}><FaFlask style={{ verticalAlign: "middle" }} /> Sample Type</th>
              <th style={{ padding: "16px 12px" }}></th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t, idx) => (
              <tr key={t.id || t._id} style={{ background: idx % 2 === 0 ? "#f9fbfd" : "#f5f7fa" }}>
                {editTestId === (t.id || t._id) ? (
                  <>
                    <td>
                      <input value={editTestName} onChange={e => setEditTestName(e.target.value)} style={{ ...inputStyle, width: "90%" }} />
                    </td>
                    <td>
                      <input type="number" min="0" step="0.01" value={editTestPrice} onChange={e => setEditTestPrice(e.target.value)} style={{ ...inputStyle, width: "90%" }} />
                    </td>
                    <td>
                      <select value={editTestSampleType} onChange={e => setEditTestSampleType(e.target.value)} style={{ ...inputStyle, width: "90%" }}>
                        <option value="">Sample Type</option>
                        {samples.map((s) => (
                          <option key={s.id || s._id} value={s.type}>{s.type}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button onClick={() => saveEditTest(t.id || t._id)} style={{ ...buttonStyle, background: "#27ae60" }}><FaSave /> Save</button>
                      <button onClick={cancelEditTest} style={{ ...buttonStyle, background: "#b0b8c1", color: "#333" }}><FaBan /> Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{t.name || t.testName}</td>
                    <td>{typeof t.price === "number" ? `₹${t.price.toFixed(2)}` : ""}</td>
                    <td>{t.sampleType}</td>
                    <td>
                      <button onClick={() => startEditTest(t)} style={{ ...buttonStyle, background: "#f1c40f", color: "#333" }}><FaEdit /> Edit</button>
                      <button onClick={() => deleteTest(t.id || t._id)} style={deleteBtnStyle} title="Delete"><FaTrashAlt /></button>
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