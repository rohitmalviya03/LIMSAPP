import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Add New Sample</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Sample Code:</label>
          <input value={sampleCode} onChange={e => setSampleCode(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <input value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Collected At:</label>
          <input type="datetime-local" value={collectedAt} onChange={e => setCollectedAt(e.target.value)} required />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option>Received</option>
            <option>Processing</option>
            <option>Completed</option>
          </select>
        </div>
        <button className="btn" type="submit">Add Sample</button>
      </form>
    </div>
  );
};

export default AddSample;