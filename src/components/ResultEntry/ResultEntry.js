import React, { useState } from "react";
import { FaSearch, FaSave } from "react-icons/fa";
import api from "../../api/api";

const cardStyle = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 2px 16px #1976d220",
  padding: 28,
  margin: "32px auto",
  maxWidth: 600,
  minHeight: 320
};
const inputStyle = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1.2px solid #b0b8c1",
  fontSize: "1rem",
  background: "#fafdff"
};
const buttonStyle = {
  padding: "8px 20px",
  background: "linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  fontSize: 15,
  boxShadow: "0 1px 4px #1976d220"
};

export default function ResultEntry() {
  const [sampleNumber, setSampleNumber] = useState("");
  const [sample, setSample] = useState(null);
  const [tests, setTests] = useState([]);
  const [entry, setEntry] = useState({});
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });
  const [loading, setLoading] = useState(false);

  // Search sample and fetch tests
  const handleSearch = async (e) => {
    e.preventDefault();
    setAlert({ show: false });
    setSample(null);
    setTests([]);
    setEntry({});
    setLoading(true);
    try {
      // Fetch sample by sample number
      const res = await api.get(`/samples/by-number/${sampleNumber}`);
      if (!res.data || !res.data.id) {
        setAlert({ show: true, type: "error", msg: "Sample not found." });
        setLoading(false);
        return;
      }
      setSample(res.data);

      // Fetch tests for this sample
      const testRes = await api.get(`/samples/${res.data.id}/tests`);
      setTests(testRes.data || []);
      setEntry({});
      setLoading(false);
    } catch {
      setAlert({ show: true, type: "error", msg: "Error fetching sample/tests." });
      setLoading(false);
    }
  };

  const handleResultChange = (testId, value) => {
    setEntry(e => ({ ...e, [testId]: value }));
  };

  const saveResults = async () => {
    if (!sample || tests.length === 0) return;
    try {
      await api.post(`/results/manual-entry`, {
        sampleId: sample.id,
        results: entry
      });
      setAlert({ show: true, type: "success", msg: "Results saved!" });
      setSample(null);
      setTests([]);
      setEntry({});
      setSampleNumber("");
    } catch {
      setAlert({ show: true, type: "error", msg: "Error saving results." });
    }
  };

  return (
    <section style={cardStyle}>
      <h2 style={{ color: "#1953a8", marginBottom: 18, fontWeight: 800, fontSize: "1.25rem" }}>
        Result Entry
      </h2>

      {alert.show && (
        <div style={{
          background: alert.type === "error" ? "#ffeaea" : "#e6f9ed",
          color: alert.type === "error" ? "#c0392b" : "#197d4b",
          border: `1.5px solid ${alert.type === "error" ? "#e74c3c" : "#27ae60"}`,
          borderRadius: 8,
          padding: "10px 16px",
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 500,
          fontSize: 15
        }}>
          <span>{alert.msg}</span>
          <button onClick={() => setAlert({ ...alert, show: false })} style={{
            background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 18
          }}>×</button>
        </div>
      )}

      {/* Search by sample number */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, marginBottom: 22, alignItems: "center" }}>
        <input
          type="text"
          value={sampleNumber}
          onChange={e => setSampleNumber(e.target.value)}
          placeholder="Enter Sample Number"
          style={{ ...inputStyle, minWidth: 180 }}
          required
        />
        <button type="submit" style={buttonStyle} disabled={loading}>
          <FaSearch /> {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Show sample and test details if found */}
      {sample && (
        <div style={{ marginBottom: 18, color: "#1953a8", fontWeight: 600 }}>
          <div>Sample #: <b>{sample.sampleId || sample.sampleCode}</b></div>
          <div>Patient: {sample.patientName}</div>
        </div>
      )}

      {sample && tests.length > 0 && (
        <>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 18,
            background: "#fafdff",
            borderRadius: 8,
            boxShadow: "0 1px 6px #e0e0e0"
          }}>
            <thead>
              <tr style={{ background: "#e3f0fc", color: "#1953a8" }}>
                <th style={{ padding: "10px 8px" }}>Test Name</th>
                <th style={{ padding: "10px 8px" }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test.id || test._id}>
                  <td style={{ padding: "10px 8px" }}>{test.name || test.testName}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <input
                      type="text"
                      value={entry[test.id || test._id] || ""}
                      onChange={e => handleResultChange(test.id || test._id, e.target.value)}
                      style={inputStyle}
                      placeholder="Enter result"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={saveResults} style={buttonStyle}>
            <FaSave /> Save Results
          </button>
        </>
      )}

      {sample && tests.length === 0 && (
        <div style={{ color: "#c0392b", marginTop: 18, fontWeight: 500 }}>
          No tests found for this sample.
        </div>
      )}
    </section>
  );
}