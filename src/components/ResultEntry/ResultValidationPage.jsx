import React, { useEffect, useState } from "react";

import api, { getLabcode } from "../../api/api";
export default function ResultValidationPage() {
  const [pendingResults, setPendingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [userMap, setUserMap] = useState({}); // { userId: userName }
  const [search, setSearch] = useState({ mrn: "", sampleId: "" });
  const [testMaster, setTestMaster] = useState({});

  useEffect(() => {
    fetchPending();
    // Fetch user master for name lookup
    api.get("auth/users-master/899").then(res => {
      const map = {};
      (res.data || []).forEach(u => { map[u.id] = u.username; });
      setUserMap(map);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    api.get("/tests-master").then(res => {
      const map = {};
      (res.data || []).forEach(t => { map[String(t.id)] = t.testName; });
      setTestMaster(map);
      console.log("Test master fetched:", res.data );
    });
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/results/pending-validation");
      setPendingResults(res.data);
      console.log("Pending results fetched:", res.data);
    } catch (err) {
      setError("Failed to load pending results.");
    }
    setLoading(false);
  };
  const userStr = localStorage.getItem("user") || '{"id":"rohitmalviya03"}';
  let obj = {};
  try {
    obj = JSON.parse(userStr);
  } catch (err) {
    obj = { id: "rohitmalviya03" };
  }
  const handleValidate = async (resultId, status, sampleId) => {
    setActionLoading(a => ({ ...a, [resultId]: true }));
   
    try {
      await api.post("/results/validate", {
        resultId,
        status,
        doctorId: obj.id,
        sampleId
      });
      setPendingResults(results => results.filter(r => r.id !== resultId));
    } catch (err) {
      alert("Failed to update result status.");
    }
    setActionLoading(a => ({ ...a, [resultId]: false }));
  };

  const filteredResults = pendingResults.filter(r =>
    (search.mrn ? (r.patientMrn || "").toLowerCase().includes(search.mrn.toLowerCase()) : true) &&
    (search.sampleId ? (r.sampleId || "").toLowerCase().includes(search.sampleId.toLowerCase()) : true)
  );

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", padding: 32 }}>
      <h2 style={{ color: "#1976d2", marginBottom: 24 }}>Result Validation</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by Patient MRN"
          value={search.mrn}
          onChange={e => setSearch(s => ({ ...s, mrn: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", width: 180 }}
        />
        <input
          type="text"
          placeholder="Search by Sample ID"
          value={search.sampleId}
          onChange={e => setSearch(s => ({ ...s, sampleId: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", width: 180 }}
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : filteredResults.length === 0 ? (
        <div>No results pending validation.</div>
      ) : (
        <div style={{
          maxHeight: 500,
          overflowY: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          background: "#f8fafd"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f0f4f8" }}>
                <th style={{ padding: 10, textAlign: "left" }}>Sample ID</th>
                <th style={{ padding: 10, textAlign: "left" }}>Patient MRN</th>
                <th style={{ padding: 10, textAlign: "left" }}>Test Name</th>
                <th style={{ padding: 10, textAlign: "left" }}>Parameter</th>
                <th style={{ padding: 10, textAlign: "left" }}>Result</th>
                <th style={{ padding: 10, textAlign: "left" }}>Entered By</th>
                <th style={{ padding: 10, textAlign: "left" }}>Entered At</th>
                <th style={{ padding: 10, textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r, idx) => (
                <tr
                  key={r.id}
                  style={{
                    background: idx % 2 === 0 ? "#e3f2fd" : "#fff",
                    borderBottom: "1px solid #e0e0e0"
                  }}
                >
                  <td style={{ padding: 10 }}>{r.sampleId}</td>
                  <td style={{ padding: 10 }}>{r.patMrn || "-"}</td>
                  <td style={{ padding: 10 }}>{testMaster[r.testId] || r.testName || r.testId}</td>
                  <td style={{ padding: 10 }}>{r.parameter || "-"}</td>
                  <td style={{ padding: 10 }}>{r.value}</td>
                  <td style={{ padding: 10 }}>
                    {userMap[r.enteredBy] || r.enteredBy}
                  </td>
                  <td style={{ padding: 10 }}>{r.enteredAt ? new Date(r.enteredAt).toLocaleString() : "-"}</td>
                  <td style={{ padding: 10 }}>
                    <button
                      style={{ background: "#43a047", color: "#fff", border: "none", borderRadius: 5, padding: "6px 16px", marginRight: 8, cursor: "pointer" }}
                      disabled={actionLoading[r.id]}
                      onClick={() => handleValidate(r.id, "approved", r.sampleId)}
                    >
                      Approve
                    </button>
                    <button
                      style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 5, padding: "6px 16px", cursor: "pointer" }}
                      disabled={actionLoading[r.id]}
                      onClick={() => handleValidate(r.id, "rejected", r.sampleId)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}