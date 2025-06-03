import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../../styles/AddSample.css"; // Create this CSS file for styles

const AddSample = () => {
  const [sampleCode, setSampleCode] = useState("");
  const [description, setDescription] = useState("");
  const [collectedAt, setCollectedAt] = useState("");
  const [status, setStatus] = useState("Received");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/samples", {
        sampleCode,
        description,
        collectedAt,
        status
      });
      navigate("/samples");
    } catch (err) {
      setError("Failed to add sample.");
    }
  };

  return (
    <div className="sample-form-container">
      <div className="sample-form-card">
        <h2 className="sample-form-title">Add New Sample</h2>
        {error && <div className="sample-form-error">{error}</div>}
        <form onSubmit={handleSubmit} className="sample-form">
          <div className="sample-form-group">
            <label>Sample Code</label>
            <input
              value={sampleCode}
              onChange={e => setSampleCode(e.target.value)}
              required
              className="sample-form-input"
              placeholder="Enter sample code"
            />
          </div>
          <div className="sample-form-group">
            <label>Description</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className="sample-form-input"
              placeholder="Enter description"
            />
          </div>
          <div className="sample-form-group">
            <label>Collected At</label>
            <input
              type="datetime-local"
              value={collectedAt}
              onChange={e => setCollectedAt(e.target.value)}
              required
              className="sample-form-input"
            />
          </div>
          <div className="sample-form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="sample-form-input"
            >
              <option>Received</option>
              <option>Processing</option>
              <option>Completed</option>
            </select>
          </div>
          <button className="sample-form-btn" type="submit">
            Add Sample
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSample;