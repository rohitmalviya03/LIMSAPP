import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";
import "../../styles/tests.css";

const statusColors = {
  Pending: "#f39c12",
  Completed: "#27ae60",
  Cancelled: "#e74c3c"
};

const billingColors = {
  Paid: "#27ae60",
  Unpaid: "#e74c3c",
  Pending: "#f39c12"
};

const statusIcons = {
  Pending: "⏳",
  Completed: "✅",
  Cancelled: "❌"
};

const billingIcons = {
  Paid: "💳",
  Unpaid: "❗",
  Pending: "⏱️"
};

const TestRaisedDetails = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/tests/${id}`);
        setTest(res.data);
      } catch (e) {
        setTest(null);
      }
      setLoading(false);
    };
    fetchTestDetails();
  }, [id]);

  if (loading)
    return (
      <div className="lims-detail-spinner">
        <div className="spinner"></div>
        <div style={{marginTop: 8, color: "#888"}}>Loading test details...</div>
      </div>
    );

  if (!test)
    return (
      <div className="lims-card lims-card-fail fade-in">
        <h2>Test not found</h2>
        <Link to="/tests" className="btn back-btn">Back to List</Link>
      </div>
    );

  return (
    <div className="lims-card lims-test-details fade-in">
      <div className="lims-details-title-row">
        <h2 className="lims-details-title">
          <span role="img" aria-label="test">🧪</span> Test Details
        </h2>
        <Link to="/tests" className="btn back-btn">← Back</Link>
      </div>
      <div className="lims-detail-grid-main">
        <div className="lims-detail-section">
          <div className="lims-detail-label">Test Name</div>
          <div className="lims-detail-value">{test.testName}</div>
        </div>
        <div className="lims-detail-section">
          <div className="lims-detail-label">Sample ID</div>
          <div className="lims-detail-value">{test.sampleNumber}</div>
        </div>
        <div className="lims-detail-section">
          <div className="lims-detail-label">Status</div>
          <div className="lims-detail-value">
            <span
              className="lims-status-pill"
              style={{
                background: statusColors[test.status] || "#888"
              }}
            >
              {statusIcons[test.status] || "🟡"} {test.status}
            </span>
          </div>
        </div>
        <div className="lims-detail-section">
          <div className="lims-detail-label">Billing Status</div>
          <div className="lims-detail-value">
            <span
              className="lims-billing-pill"
              style={{
                background: billingColors[test.billingStatus] || "#888"
              }}
            >
              {billingIcons[test.billingStatus] || "💲"} {test.billingStatus}
            </span>
          </div>
        </div>
        <div className="lims-detail-section">
          <div className="lims-detail-label">Date Raised</div>
          <div className="lims-detail-value">
            {new Date(test.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="lims-detail-section">
          <div className="lims-detail-label">Raised By</div>
          <div className="lims-detail-value">{test.createbyUser	}</div>
        </div>
      </div>
      <div className="lims-patient-section fade-in" style={{animationDelay: '0.2s'}}>
        <div className="lims-patient-title">👤 Patient Information</div>
        <div className="lims-patient-grid">
          <div>
            <div className="lims-detail-label">Name</div>
            <div className="lims-detail-value">{test.patient.firstName +' '+test.patient.lastName || (test.patient && test.patient.firstName)}</div>
          </div>
          <div>
            <div className="lims-detail-label">Age</div>
            <div className="lims-detail-value">{test.patient?.dob ?? "-"}</div>
          </div>
          <div>
            <div className="lims-detail-label">Gender</div>
            <div className="lims-detail-value">{test.patient?.gender ?? "-"}</div>
          </div>
          <div>
            <div className="lims-detail-label">Contact</div>
            <div className="lims-detail-value">{test.patient?.contact ?? "-"}</div>
          </div>
        </div>
      </div>
      {test.notes && (
        <div className="lims-notes-section fade-in" style={{animationDelay: '0.35s'}}>
          <div className="lims-detail-label">Notes</div>
          <div className="lims-detail-value">{test.notes}</div>
        </div>
      )}
    </div>
  );
};

export default TestRaisedDetails;