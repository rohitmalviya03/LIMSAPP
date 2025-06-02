import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/tests.css';

const AddTestRaised = () => {
  const [form, setForm] = useState({
    testName: "",
    sampleId: "",
    patientName: "",
    notes: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Test Raised!");
    navigate("/tests");
  };

  return (
    <div className="lims-container">
      <h2 className="lims-title">🧪 Raise a New Lab Test</h2>
      <form className="lims-form" onSubmit={handleSubmit}>
        <div className="lims-form-group">
          <label htmlFor="testName">Test Name</label>
          <input
            type="text"
            id="testName"
            name="testName"
            placeholder="Enter test name (e.g. CBC, Blood Sugar)"
            value={form.testName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="lims-form-group">
          <label htmlFor="sampleId">Sample ID</label>
          <input
            type="text"
            id="sampleId"
            name="sampleId"
            placeholder="Enter sample ID"
            value={form.sampleId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="lims-form-group">
          <label htmlFor="patientName">Patient Name</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            placeholder="Enter patient's full name"
            value={form.patientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="lims-form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Any special instructions or comments..."
            value={form.notes}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button type="submit" className="btn btn-primary">✅ Raise Test</button>
      </form>
    </div>
  );
};

export default AddTestRaised;
