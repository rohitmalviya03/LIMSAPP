// LabOptionsModal.js
import React from "react";
import { Link } from "react-router-dom";

const modalStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};
const boxStyle = {
  background: "#fff",
  borderRadius: 10,
  padding: 32,
  minWidth: 260,
  boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: 18,
  alignItems: "center"
};

const LabOptionsModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={boxStyle} onClick={e => e.stopPropagation()}>
        <h3 style={{ color: "#1976d2", marginBottom: 10 }}>Lab Options</h3>
        <Link to="/labmaster/add" style={{ color: "#1976d2", fontWeight: 500, textDecoration: "underline" }}>
          Add New Lab
        </Link>
        <Link to="/labmaster/list" style={{ color: "#1976d2", fontWeight: 500, textDecoration: "underline" }}>
          Show All Labs
        </Link>
        {/* <Link to="/labmaster/edit" style={{ color: "#1976d2", fontWeight: 500, textDecoration: "underline" }}>
          Edit Lab
        </Link> */}
        <button
          onClick={onClose}
          style={{
            marginTop: 18,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "8px 18px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LabOptionsModal;