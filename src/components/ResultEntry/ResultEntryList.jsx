import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/ResultEntryList.css";
import ResultEntryDialog from "./ResultEntryDialog";

export default function ResultEntryList() {
  const [pending, setPending] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testMaster, setTestMaster] = useState({});

  useEffect(() => {
    fetchPending();
  }, []);

  // Fetch collected samples that are ready for result entry
  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/samples/collected"); // Should return array of collected samples
      // Check structure: sample.patient should exist
      console.log("ResultEntryList - pending samples:", res.data);
      setPending(res.data || []);
    } catch {
      setPending([]);
    }
    setLoading(false);
  };

  // Fetch test master for test name mapping
  useEffect(() => {
    api.get("/tests-master")
      .then(res => {
        const map = {};
        (res.data || []).forEach(t => { map[String(t.id)] = t.testName; });
        setTestMaster(map);
      })
      .catch(() => setTestMaster({}));
  }, []);

  const handleResultEntry = (sample) => setSelected(sample);

  const handleResultSaved = () => {
    setSelected(null);
    fetchPending();
  };

  return (
    <div className="lims-card-modern">
      <h2 className="lims-title">Pending Result Entry</h2>
      {loading ? (
        <div className="lims-loader">
          <div className="lds-dual-ring"></div>
          <span>Loading...</span>
        </div>
      ) : pending.length === 0 ? (
        <div className="lims-no-data">
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Data" />
          <p>No samples pending result entry.</p>
        </div>
      ) : (
        <div className="lims-table-responsive">
          <table className="lims-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Sample ID</th>
                <th>Tests</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(sample => (
                <tr key={sample.sampleId}>
                  <td>
                    <span className="lims-patient-avatar">
                      {sample.patientName ? sample.patientName[0] : "?"}
                    </span>
                    {sample.patientName || "Unknown"}
                  </td>
                  <td>{sample.sampleId}</td>
                  <td>
                    {String(sample.tests)
                      .split(",")
                      .map(id => testMaster[String(id.trim())] || id)
                      .join(", ")}
                  </td>
                  <td>
                    <span className="lims-status-pill status-pending">Pending</span>
                  </td>
                  <td>
                    <button
                      className="lims-result-btn"
                      onClick={() => handleResultEntry(sample)}
                    >
                      Enter Result
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <ResultEntryDialog sample={selected} onClose={handleResultSaved} />
      )}
    </div>
  );
}

// You will need to create a ResultEntryDialog component for entering results.