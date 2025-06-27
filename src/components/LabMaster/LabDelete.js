import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

const LabDelete = ({ onDeleted, onCancel }) => {
  const { id: labId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    try {
      await api.delete(`/lab/${labId}`);
      setMessage("Lab deleted successfully.");
      if (onDeleted) onDeleted();
      setTimeout(() => {
        navigate("/labmaster/list");
      }, 1000);
    } catch {
      setMessage("Failed to delete lab.");
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate("/labmaster/list");
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8, maxWidth: 400, margin: "20px auto" }}>
      <h3>Delete Lab</h3>
      <p>Are you sure you want to delete this lab?</p>
      <button onClick={handleDelete} style={{ background: "#d32f2f", color: "#fff", marginRight: 8 }}>Delete</button>
      <button onClick={handleCancel} style={{ marginRight: 8 }}>Cancel</button>
      <button onClick={handleBack} style={{ background: "#1976d2", color: "#fff" }}>Back</button>
      {message && <div style={{ marginTop: 10, color: "#d32f2f" }}>{message}</div>}
    </div>
  );
};

export default LabDelete;