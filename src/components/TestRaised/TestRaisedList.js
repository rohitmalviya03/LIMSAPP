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
    console.log(res.data);
    setTests(res.data);
    setLoading(false);
  };

  return (
    <div className="test-list-card">
      <div className="test-list-header">
        <h2>Tests Raised</h2>
        <Link to="/tests/add" className="btn raise-btn">+ Raise New Test</Link>
      </div>
      <div className="test-list-filter">
        <label>
          <span>Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="lims-select"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <table className="lims-table test-list-table">
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
              <tr key={test._id} className="fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                <td>{test.testName}</td>
                <td>{test.patientName || (test.patient && test.patient.mrn)}</td>
                <td>{test.sampleNumber}</td>
                <td>{new Date(test.createbyUser	).toLocaleString()}</td>
                <td>
                  <span className={`status-pill status-${(test.status || "").toLowerCase()}`}>
                    {test.status}
                  </span>
                </td>
                <td>{test.createdBy}</td>
                <td>
                  <Link to={`/tests/${test.id}`} className="details-link">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {(!loading && tests.length === 0) && <div className="no-tests-msg">No tests found.</div>}
    </div>
  );
};

export default TestRaisedList;