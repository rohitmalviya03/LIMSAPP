import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import "../../styles/tests.css";

const statusOptions = ["All", "Pending", "Completed", "Cancelled"];

const TestRaisedList = () => {
  const [tests, setTests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
    // eslint-disable-next-line
  }, [statusFilter]);

  const fetchTests = async () => {
    setLoading(true);
    let url = "/teststatus";
    if (statusFilter !== "All") {
      url += `?status=${statusFilter}`;
    }
    const res = await api.get(url);
    setTests(res.data);
    setLoading(false);
  };

  return (
    <div className="test-list-modern-bg">
      <div className="test-list-modern-card fade-in">
        <div className="test-list-header-modern">
          <h2 className="test-list-title-modern">🧪 Tests Raised</h2>
          <Link to="/tests/add" className="btn raise-btn-modern">+ Raise New Test</Link>
        </div>
        <div className="test-list-filter-modern">
          <label>
            <span>Filter by Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="lims-select-modern"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>
        {loading ? (
          <div className="lims-loader-modern">
            <div className="lds-dual-ring"></div>
            <span>Loading...</span>
          </div>
        ) : tests.length === 0 ? (
          <div className="no-tests-msg-modern">
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Data" />
            <p>No tests found.</p>
          </div>
        ) : (
          <div className="lims-table-responsive">
            <table className="lims-table test-list-table-modern">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Patient</th>
                  <th>Sample #</th>
                  <th>Date Raised</th>
                  <th>Status</th>
                  <th>Raised By</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test, idx) => (
                  <tr key={test._id || test.id} className="fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                    <td>{test.testName}</td>
                    <td>{test.patientName || (test.patient && test.patient.mrn)}</td>
                    <td>{test.sampleNumber}</td>
                    <td>{test.createdAt ? new Date(test.createdAt).toLocaleString() : ""}</td>
                    <td>
                      <span className={`status-pill-modern status-${(test.status || "").toLowerCase()}`}>
                        {test.status}
                      </span>
                    </td>
                    <td>{test.createdBy}</td>
                    <td>
                      <Link to={`/tests/${test.id || test._id}`} className="details-link-modern">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestRaisedList;