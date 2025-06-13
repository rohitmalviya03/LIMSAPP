import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function ReportSearchPage() {
  const [patientId, setPatientId] = useState("");
  const [sampleId, setSampleId] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [testMaster, setTestMaster] = useState({}); // { testId: testName }
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const params = [];
      if (patientId) params.push(`patientId=${patientId}`);
      if (sampleId) params.push(`sampleId=${sampleId}`);
      if (entryDate) params.push(`entryDate=${entryDate}`);
      if (params.length === 0) {
        setError("Please enter at least one search criteria.");
        setLoading(false);
        return;
      }
      const res = await api.get(`/results/report/search?${params.join("&")}`);
      // Deduplicate by sampleId+testId
      const unique = new Map();
      res.data.forEach(r => {
        const key = `${r.sampleId}_${r.testId}`;
        if (!unique.has(key)) unique.set(key, r);
      });
      console.log(results);
      setResults(Array.from(unique.values()));
       console.log(results);
    } catch {
      setError("No results found or failed to search.");
    }
    setLoading(false);
  };

  const handleViewReport = (sampleId, testId) => {
    navigate(`/results/report/view?sampleId=${sampleId}&testId=${testId}`);
  };

  // Fetch test master list and build a map {id: name}
  useEffect(() => {
    api.get("/tests-master")
      .then(res => {

        
        // Map as array of { testId, testName }
        const mapped = (res.data || []).map(t => ({
          
          testId: t.id,
          testName: t.testName
        
        
        }
      )
      
      
      );

         // If you still want the map for fast lookup:
        const map = {};
        mapped.forEach(t => { map[String(t.testId)] = t.testName; }
      
      
      );
        setTestMaster(map); // <-- set the map, not the array!
        
      })
      .catch(() => setTestMaster({}));
  }, []);
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", padding: 32 }}>
      <h2 style={{ color: "#1976d2", marginBottom: 24 }}>Search Reports</h2>
      <form onSubmit={handleSearch}>
        <div style={{ marginBottom: 16 }}>
          <label>Patient ID:</label>
          <input
            type="text"
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            placeholder="Enter Patient ID"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Sample ID:</label>
          <input
            type="text"
            value={sampleId}
            onChange={e => setSampleId(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            placeholder="Enter Sample ID"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Result Entry Date:</label>
          <input
            type="date"
            value={entryDate}
            onChange={e => setEntryDate(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
        <button
          type="submit"
          style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontWeight: 500, fontSize: 16 }}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      {results.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h4>Search Results</h4>
          <div style={{
      maxHeight: 350,
      overflowY: "auto",
      border: "1px solid #e0e0e0",
      borderRadius: 8,
      background: "#f8fafd"
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f4f8" }}>
            <th style={{ padding: 8 }}>Sample ID</th>
            <th style={{ padding: 8 }}>Patient Name</th>
            <th style={{ padding: 8 }}>Test Name</th>
                        <th style={{ padding: 8 }}>Result Enterd</th>
            <th style={{ padding: 8 }}>Validated Date</th>
            <th style={{ padding: 8 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr
              key={`${r.sampleId}_${r.testId}`}
              style={{
                background: idx % 2 === 0 ? "#e3f2fd" : "#fff", // alternate row highlight
                borderBottom: "1px solid #e0e0e0"
              }}
            >
              <td style={{ padding: 8, fontWeight: 500 }}>{r.sampleId}</td>
              <td style={{ padding: 8, fontWeight: 500, color: "#1976d2" }}>{r.patName}</td>
              <td style={{ padding: 8 }}>{testMaster[r.testId] || r.testName || r.testId}</td>
              <td style={{ padding: 8 }}>{r.resEnteredAt ? new Date(r.resEnteredAt).toLocaleString() : "-"}</td>
             
              <td style={{ padding: 8 }}>{r.validatedAt ? new Date(r.validatedAt).toLocaleString() : "-"}</td>
              
              <td style={{ padding: 8 }}>
                <button
                  onClick={() => handleViewReport(r.sampleId, r.testId)}
                  style={{
                    background: "#388e3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 16px",
                    fontWeight: 500,
                    fontSize: 15
                  }}
                >
                  View Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
      )}
    </div>
  );
}