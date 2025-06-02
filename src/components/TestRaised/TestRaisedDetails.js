import React from "react";
import { useParams } from "react-router-dom";
import '../../styles/tests.css';

const dummyDetails = {
  1: {
    id: 1,
    testName: "Blood Glucose",
    sampleId: "S-1001",
    patientName: "John Doe",
    dateRaised: "2025-06-02",
    status: "Pending",
    notes: "Urgent processing required.",
    orderedBy: "labuser1"
  },
  // ... more
};

const statusColors = {
  Pending: "#f39c12",
  Completed: "#27ae60",
  Cancelled: "#e74c3c"
};

const TestRaisedDetails = () => {
  const { id } = useParams();
  const test = dummyDetails[id];

  if (!test) return <div className="lims-card"><h2>Test not found</h2></div>;

  return (
    <div className="lims-card lims-test-details">
      <h2 className="lims-details-title">
        <span role="img" aria-label="test">🧪</span> Test Details
      </h2>
      <div className="lims-details-grid">
        <div>
          <div className="lims-details-label">Test Name</div>
          <div className="lims-details-value">{test.testName}</div>
        </div>
        <div>
          <div className="lims-details-label">Sample ID</div>
          <div className="lims-details-value">{test.sampleId}</div>
        </div>
        <div>
          <div className="lims-details-label">Patient Name</div>
          <div className="lims-details-value">{test.patientName}</div>
        </div>
        <div>
          <div className="lims-details-label">Status</div>
          <div className="lims-details-value">
            <span style={{
              color: "#fff",
              background: statusColors[test.status] || "#888",
              padding: "2px 10px",
              borderRadius: "12px",
              fontWeight: "bold"
            }}>
              {test.status}
            </span>
          </div>
        </div>
        <div>
          <div className="lims-details-label">Date Raised</div>
          <div className="lims-details-value">{test.dateRaised}</div>
        </div>
        <div>
          <div className="lims-details-label">Ordered By</div>
          <div className="lims-details-value">{test.orderedBy}</div>
        </div>
        <div className="lims-details-notes">
          <div className="lims-details-label">Notes</div>
          <div className="lims-details-value">{test.notes}</div>
        </div>
      </div>
    </div>
  );
};

export default TestRaisedDetails;