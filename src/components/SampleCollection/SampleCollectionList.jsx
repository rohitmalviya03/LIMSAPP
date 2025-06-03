import React, { useEffect, useState } from "react";
import axios from "axios";
import CollectSampleDialog from "./CollectSampleDialog";
import api from "../../api/api";
export default function SampleCollectionList() {
  const [pending, setPending] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const data=api.get("/samples/pending")
      .then(res => setPending(res.data || [])
    
    );

console.log(data);

  }, []);

  const handleCollect = (sample) => setSelected(sample);

  const handleCollected = () => {
    setSelected(null);
    api.get("/samples/pending").then(res => setPending(res.data || []));
  };

  return (
    <div className="lims-card" style={{ maxWidth: 900, margin: "24px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 14px #1976d230", padding: "32px 30px" }}>
      <h2 style={{ color: "#1953a8", fontWeight: 700, fontSize: 24, marginBottom: 18, letterSpacing: 1 }}>Pending Sample Collections</h2>
      <table style={{ width: "100%", borderSpacing: 0, fontSize: 15 }}>
        <thead>
          <tr style={{ background: "#e1f5f2" }}>
            <th style={{ padding: "10px 8px", color: "#1976d2" }}>Patient</th>
            <th style={{ padding: "10px 8px", color: "#1976d2" }}>Sample ID</th>
            <th style={{ padding: "10px 8px", color: "#1976d2" }}>Tests</th>
            <th style={{ padding: "10px 8px", color: "#1976d2" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.map(sample => (
            <tr key={sample.sampleId} style={{ background: "#fafdff" }}>
              <td style={{ padding: "10px 8px" }}>{sample.patient.firstName} ({sample.patient.mrn})</td>
              <td style={{ padding: "10px 8px" }}>{sample.sampleNumber}</td>
              <td style={{ padding: "10px 8px" }}>{sample.testName}</td>
              <td style={{ padding: "10px 8px" }}>
                <button
                  onClick={() => handleCollect(sample)}
                  style={{
                    padding: "4px 15px",
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}>
                  Collect
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && <CollectSampleDialog sample={selected} onClose={handleCollected} />}
    </div>
  );
}