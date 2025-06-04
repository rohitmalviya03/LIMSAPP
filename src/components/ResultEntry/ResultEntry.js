import React, { useState, useEffect } from "react";
import { FaEdit, FaUpload, FaCheck, FaSave } from "react-icons/fa";
import api from "../../api/api";

const cardStyle = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 2px 16px #1976d220",
  padding: 22,
  margin: "24px auto",
  maxWidth: 900,
  minHeight: 400
};
const tabBtnStyle = isActive => ({
  padding: "8px 22px",
  border: "none",
  borderBottom: isActive ? "3px solid #1976d2" : "3px solid transparent",
  background: "none",
  fontWeight: 700,
  color: isActive ? "#1976d2" : "#444",
  fontSize: 16,
  cursor: "pointer",
  transition: "color 0.2s"
});
const inputStyle = {
  padding: "7px 10px",
  borderRadius: 6,
  border: "1.2px solid #b0b8c1",
  fontSize: "1rem",
  background: "#fafdff"
};
const buttonStyle = {
  padding: "7px 16px",
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
  const [activeTab, setActiveTab] = useState("manual");
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState("");
  const [results, setResults] = useState([]);
  const [entry, setEntry] = useState({});
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    // Fetch only processed samples needing result entry
    const res = await api.get("/samples/processed");
    setSamples(res.data);
  };

  const fetchResults = async (sampleId) => {
    // Fetch test list for the selected sample
    const res = await api.get(`/samples/${sampleId}/tests`);
    setResults(res.data);
    setEntry({});
  };

  const handleResultChange = (testId, value) => {
    setEntry(e => ({ ...e, [testId]: value }));
  };

  const saveResults = async () => {
    try {
      await api.post(`/results/manual-entry`, {
        sampleId: selectedSample,
        results: entry
      });
      setAlert({ show: true, type: "success", msg: "Results saved!" });
      setSelectedSample("");
      setResults([]);
      setEntry({});
    } catch {
      setAlert({ show: true, type: "error", msg: "Error saving results." });
    }
  };

  // For machine import, you can add file upload logic here
  const handleMachineImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Example: send file to backend
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/results/import-machine", formData);
      setAlert({ show: true, type: "success", msg: "Results imported from machine!" });
    } catch {
      setAlert({ show: true, type: "error", msg: "Import failed." });
    }
  };

  // Filter samples by search text (sampleId, sampleCode, or name)
  const filteredSamples = samples.filter(s =>
    (s.sampleId || s.sampleCode || s.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section style={cardStyle}>
      <h2 style={{ color: "#1953a8", marginBottom: 18, fontWeight: 800, fontSize: "1.25rem" }}>
        Result Entry
      </h2>
      <div style={{ display: "flex", gap: 0, borderBottom: "1.5px solid #e3f0fc", marginBottom: 22 }}>
        <button style={tabBtnStyle(activeTab === "manual")} onClick={() => setActiveTab("manual")}>
          <FaEdit /> Manual Entry
        </button>
        <button style={tabBtnStyle(activeTab === "machine")} onClick={() => setActiveTab("machine")}>
          <FaUpload /> Machine Import
        </button>
      </div>

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

      {activeTab === "manual" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center" }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search sample number..."
              style={{ ...inputStyle, minWidth: 180 }}
            />
            <select
              value={selectedSample}
              onChange={e => {
                setSelectedSample(e.target.value);
                if (e.target.value) fetchResults(e.target.value);
                else setResults([]);
              }}
              style={{ ...inputStyle, minWidth: 220 }}
            >
              <option value="">Select Processed Sample</option>
              {filteredSamples.map(s => (
                <option key={s.id || s._id} value={s.id || s._id}>
                  {s.sampleId || s.sampleCode || s.name}
                </option>
              ))}
            </select>
          </div>
          {/* Only show the result entry form if a sample is selected */}
          {selectedSample && results.length > 0 && (
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
                  {results.map(test => (
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
        </div>
      )}

      {activeTab === "machine" && (
        <div style={{ marginTop: 24 }}>
          <label style={{ fontWeight: 600, color: "#1953a8", marginBottom: 10, display: "block" }}>
            Upload Machine Result File
          </label>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleMachineImport}
            style={{
              marginBottom: 18,
              padding: "8px 0",
              border: "1px solid #b0b8c1",
              borderRadius: 6,
              background: "#fafdff"
            }}
          />
          <div style={{ color: "#888", fontSize: 14 }}>
            Supported: CSV, Excel. Results will be auto-mapped to processed samples.
          </div>
        </div>
      )}
    </section>
  );
}