import React from "react";
import Barcode from "react-barcode";

export default function SampleCollectionSlip({ sample, onClose }) {
  return (
    <div className="lims-modal-overlay">
      <div className="lims-modal-content" style={{ background: "#fff", borderRadius: 10, minWidth: 340, padding: 28, maxWidth: 410, boxShadow: "0 2px 14px #1976d230" }}>
        <h2 style={{ color: "#1953a8", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Sample Collection Slip</h2>
        <div><b>Patient:</b>{sample.patient.firstName} ({sample.patient.mrn})</div>
        <div><b>Sample ID:</b> {sample.sampleNumber}</div>
        <div><b>Tests:</b> {sample.testName}</div>
        <div><b>Collected At:</b> {new Date(sample.collectedAt).toLocaleString()}</div>
        {sample.collector && <div><b>Collector:</b> {sample.collector}</div>}
        <div style={{ margin: "18px 0" }}>
          <Barcode value={sample.sampleId} format="CODE128" width={1.5} height={46} fontSize={14} />
        </div>
        <div style={{ marginTop: 10 }}>
          <button
            onClick={onClose}
            style={{
              padding: "7px 20px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer",
              marginRight: 10
            }}>Close</button>
          <button
            onClick={() => window.print()}
            style={{
              padding: "7px 18px",
              background: "#f5f7fa",
              color: "#1976d2",
              border: "1px solid #1976d2",
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer"
            }}>Print</button>
        </div>
      </div>
    </div>
  );
}