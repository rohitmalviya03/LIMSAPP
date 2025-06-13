import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import "../../styles/tests.css";

const statusOptions = ["All", "Pending", "Completed", "Cancelled"];

const TestRaisedList = () => {
  const [tests, setTests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [testMaster, setTestMaster] = useState({}); // { testId: testName }
  const [userMaster, setUserMaster] = useState({}); // { userId: userName }

  useEffect(() => {
    fetchTests();
    // eslint-disable-next-line
  }, [statusFilter]);

  // Fetch test master list and build a map {id: name}
  useEffect(() => {
    api.get("/tests-master")
      .then(res => {

        
        // Map as array of { testId, testName }
        const mapped = (res.data || []).map(t => ({
          
          testId: t.id,
          testName: t.testName
        
        
        }
      )
      
      
      );

         // If you still want the map for fast lookup:
        const map = {};
        mapped.forEach(t => { map[String(t.testId)] = t.testName; }
      
      
      );
        setTestMaster(map); // <-- set the map, not the array!
        
      })
      .catch(() => setTestMaster({}));
  }, []);

  // Fetch user master list and build a map {id: name}
  useEffect(() => {
    api.get("/auth/users-master") // <-- Your endpoint to get all users
      .then(res => {
        const map = {};
        console.log("TestRaisedList - user master data:", res.data);
        (res.data || []).forEach(u => { map[String(u.id)] = u.username; });
        setUserMaster(map);
      })
      .catch(() => setUserMaster({}));
  }, []);

  console.log("TestRaisedList - userMaster:", userMaster);
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
                    {/* Fetch test name by testId */}
                    <td>{testMaster[String(test.testName)] || test.testName || test.testId}</td>
                    <td>{test.patientName || (test.patient && test.patient.mrn)}</td>
                    <td>{test.sampleNumber}</td>
                    <td>{test.createdAt ? new Date(test.createdAt).toLocaleString() : ""}</td>
                    <td>
                      <span className={`status-pill-modern status-${(test.status || "").toLowerCase()}`}>
                        {test.status}
                      </span>
                    </td>
                    {/* Fetch user name by createdBy */}
                    <td>{userMaster[String(test.createdBy)] || test.createdBy}</td>
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