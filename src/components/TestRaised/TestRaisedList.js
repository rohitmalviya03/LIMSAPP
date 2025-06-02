import React from "react";
import { Link } from "react-router-dom";
import '../../styles/tests.css';
const dummyData = [
  {
    id: 1,
    testName: "Blood Glucose",
    patientName: "John Doe",
    sampleId: "S-1001",
    dateRaised: "2025-06-02",
    status: "Pending",
  },
  {
    id: 2,
    testName: "CBC",
    patientName: "Jane Smith",
    sampleId: "S-1002",
    dateRaised: "2025-06-01",
    status: "Completed",
  },
];

const TestRaisedList = () => (
  <div>
    <h2>Tests Raised</h2>
    <Link to="/tests/add" className="btn">+ Raise New Test</Link>
    <table className="lims-table">
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Patient</th>
          <th>Sample</th>
          <th>Date Raised</th>
          <th>Status</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {dummyData.map((test) => (
          <tr key={test.id}>
            <td>{test.testName}</td>
            <td>{test.patientName}</td>
            <td>{test.sampleId}</td>
            <td>{test.dateRaised}</td>
            <td>
              <span className={`status-pill status-${test.status.toLowerCase()}`}>
                {test.status}
              </span>
            </td>
            <td>
              <Link to={`/tests/${test.id}`}>View</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TestRaisedList;