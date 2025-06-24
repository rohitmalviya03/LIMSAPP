import React, { useState } from "react";
import axios from "axios";
import SampleCollectionSlip from "./SampleCollectionSlip";
import api from "../../api/api";


import { useAuth } from "../../context/AuthContext";
export default function CollectSampleDialog({ sample, onClose }) {
  const [collector, setCollector] = useState("");
  const [collectedAt, setCollectedAt] = useState(new Date().toISOString());
  const [submitted, setSubmitted] = useState(false);

  const { getLabcode } = useAuth();
const labcode = getLabcode(); // Get labcode from context
  const [testMaster, setTestMaster] = useState({}); // { testId: testName }


  const handleSubmit = async () => {
    await api.post("/samples/collect", {
      sampleId: sample.sampleNumber,
      collectedAt,
      collector
    });
    setSubmitted(true);
  };





  if (submitted) {
    return (
      <SampleCollectionSlip
        sample={{ ...sample, collectedAt, collector }}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="lims-modal-overlay">
      <div className="lims-modal-content" style={{ background: "#fff", borderRadius: 14, padding: 32, minWidth: 330, boxShadow: "0 2px 16px #1976d230" }}>
        <h3 style={{ color: "#1953a8", fontWeight: 700, fontSize: 21, marginBottom: 10 }}>Collect Sample</h3>
       <td style={{ padding: "10px 8px" }}>{sample.patient.firstName} ({sample.patient.mrn})</td>
              <td style={{ padding: "10px 8px" }}>{sample.sampleNumber}</td>
              <td style={{ padding: "10px 8px" }}>sdfd
                {testMaster[sample.testName]}
              </td>
        <div style={{ marginTop: 16 }}>
          <label>
            Collector Name:
            <input value={collector} onChange={e => setCollector(e.target.value)} style={{ marginLeft: 8, padding: 5, borderRadius: 5, border: "1px solid #ccc" }} />
          </label>
        </div>
        <div style={{ marginTop: 10 }}>
          <label>
            Collection Date/Time:
            <input
              type="datetime-local"
              value={collectedAt}
              onChange={e => setCollectedAt(e.target.value)}
              style={{ marginLeft: 8, padding: 5, borderRadius: 5, border: "1px solid #ccc" }}
            />
          </label>
        </div>
        <div style={{ marginTop: 22 }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "7px 24px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              marginRight: 10,
              cursor: "pointer"
            }}>Submit & Print Slip</button>
          <button
            onClick={onClose}
            style={{
              padding: "7px 18px",
              background: "#f5f7fa",
              color: "#1976d2",
              border: "1px solid #1976d2",
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer"
            }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}