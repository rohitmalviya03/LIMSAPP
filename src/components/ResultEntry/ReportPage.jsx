// Example: ReportPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const sampleId = searchParams.get("sampleId");
  const testId = searchParams.get("testId");
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testMaster, setTestMaster] = useState({});
  const [userMap, setUserMap] = useState({});
  const [patientName, setPatientName] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientDob, setPatientDob] = useState("");
  const [patientMrn, setPatientMrn] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [collectionDate, setCollectionDate] = useState("");

  // Fetch test master and user master maps
  useEffect(() => {
    api.get("/tests-master")
      .then(res => {
        const map = {};
        (res.data || []).forEach(t => { map[String(t.id)] = t.testName; });
        setTestMaster(map);
      })
      .catch(() => setTestMaster({}));
    api.get("auth/users-master")
      .then(res => {
        const map = {};
        (res.data || []).forEach(u => { map[u.id] = u.username; });
        setUserMap(map);
      })
      .catch(() => setUserMap({}));
  }, []);

  // Fetch report data and patient details
  useEffect(() => {
    if (!sampleId || !testId) {
      setError("Missing sampleId or testId.");
      setLoading(false);
      return;
    }
    api.get(`/results/report?sampleId=${sampleId}&testId=${testId}`)
      .then(res => {
        setReport(res.data);
        if (res.data && res.data.length > 0) {
          setEntryDate(res.data[0].enteredAt || res.data[0].enterdAt || "-");
          setCollectionDate(
            res.data[0].sample?.collectedAt ||
            res.data[0].collectedAt ||
            "-"
          );
          // Fetch patient details from patient master if patientId is available
          const patientId = res.data[0].sample?.patientId || res.data[0].patientId;
          if (patientId) {
            api.get(`/patients/${patientId}`)
              .then(patRes => {
                const pat = patRes.data || {};
                setPatientName(
                  (pat.firstName ? pat.firstName + " " : "") +
                  (pat.lastName || "")
                );
                setPatientGender(pat.gender || "-");
                setPatientDob(pat.dob ? new Date(pat.dob).toLocaleDateString() : "-");
                setPatientMrn(pat.mrn || "-");
              })
              .catch(() => {
                setPatientName("-");
                setPatientGender("-");
                setPatientDob("-");
                setPatientMrn("-");
              });
          } else {
            setPatientName(res.data[0].firstName + " " + (res.data[0].lastName || "") || "-");
            setPatientGender(res.data[0].gender || "-");
            setPatientDob(res.data[0].dob ? new Date(res.data[0].dob).toLocaleDateString() : "-");
            setPatientMrn(res.data[0].mrn || "-");
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No approved results found or failed to load report.");
        setLoading(false);
      });
  }, [sampleId, testId]);

  if (loading) return <div>Loading report...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Get test name from master map
  const displayTestName = testMaster[testId] || report[0]?.testName || testId;
  // Get validated by and at from the first result (assuming all are the same)
  const validatedBy = report[0]?.validatedBy ? (userMap[report[0].validatedBy] || report[0].validatedBy) : "-";
  const validatedAt = report[0]?.validatedAt ? new Date(report[0].validatedAt).toLocaleString() : "-";

  return (
    <div style={{ background: "#fff", padding: 32, borderRadius: 12, maxWidth: 700, margin: "40px auto", fontFamily: "serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid #1976d2", marginBottom: 24, paddingBottom: 12 }}>
        <h1 style={{ color: "#1976d2", margin: 0 }}>Your Lab Name</h1>
        <div style={{ fontSize: 16, color: "#555" }}>Address line 1, City, State, ZIP</div>
        <div style={{ fontSize: 15, color: "#888" }}>Phone: 123-456-7890 | Email: info@yourlab.com</div>
      </div>
      {/* Patient & Sample Info */}
      <div
        style={{
          marginBottom: 28,
          background: "#f6fafd",
          borderRadius: 10,
          padding: "20px 28px",
          border: "1px solid #e0e0e0",
          maxWidth: 700,
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 0
        }}
      >
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 600, color: "#1976d2", marginBottom: 8 }}>Patient Details</div>
          <div><b>Name:</b> {patientName}</div>
          <div><b>MRN:</b> {patientMrn}</div>
          <div><b>Gender:</b> {patientGender}</div>
          <div><b>Date of Birth:</b> {patientDob}</div>
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 600, color: "#1976d2", marginBottom: 8 }}>Sample & Test</div>
          <div><b>Sample ID:</b> {sampleId}</div>
          <div><b>Collection Date:</b> {collectionDate !== "-" ? new Date(collectionDate).toLocaleString() : "-"}</div>
          <div><b>Test Name:</b> {displayTestName}</div>
          <div><b>Entry Date:</b> {entryDate ? new Date(entryDate).toLocaleDateString() : "-"}</div>
        </div>
      </div>
      {/* Results Table */}
      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse", marginBottom: 32 }}>
        <thead>
          <tr style={{ background: "#f0f4f8" }}>
            <th style={{ padding: 10, textAlign: "left" }}>Parameter</th>
            <th style={{ padding: 10, textAlign: "left" }}>Result</th>
            <th style={{ padding: 10, textAlign: "left" }}>Reference Range</th>
          </tr>
        </thead>
        <tbody>
          {report.map(r => (
            <tr key={r.id}>
              <td style={{ padding: 10 }}>{r.parameter || "-"}</td>
              <td style={{ padding: 10 }}>{r.value}</td>
              <td style={{ padding: 10 }}>{r.referenceRange || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Validated By/At */}
      <div style={{ marginBottom: 24, fontSize: 16 }}>
        <b>Validated By:</b> {validatedBy}<br />
        <b>Validated At:</b> {validatedAt}
      </div>
      {/* Footer */}
      <div style={{ borderTop: "2px solid #1976d2", paddingTop: 16, color: "#555", fontSize: 15 }}>
        <div>Report generated on: {new Date().toLocaleString()}</div>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
          <div>
            <b>Doctor's Signature</b>
            <div style={{ borderBottom: "1px solid #888", width: 180, marginTop: 24 }}></div>
          </div>
          <div>
            <b>Lab Technician</b>
            <div style={{ borderBottom: "1px solid #888", width: 180, marginTop: 24 }}></div>
          </div>
        </div>
      </div>
      <button
        className="no-print"
        style={{
          marginTop: 32,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 24px",
          fontWeight: 500,
          fontSize: 16
        }}
        onClick={() => window.print()}
      >
        Print Report
      </button>
    </div>
  );
}