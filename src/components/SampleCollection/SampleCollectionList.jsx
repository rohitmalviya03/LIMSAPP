import React, { useEffect, useState } from "react";
import CollectSampleDialog from "./CollectSampleDialog";
import api from "../../api/api";
import "../../styles/SampleCollectionList.css";

export default function SampleCollectionList() {
  const [pending, setPending] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/samples/pending");
      setPending(res.data || []);
    } catch (err) {
      setPending([]);
    }
    setLoading(false);
  };

  const handleCollect = (sample) => setSelected(sample);

  const handleCollected = () => {
    setSelected(null);
    fetchPending();
  };

  return (
    <div className="lims-card-modern">
      <h2 className="lims-title">Pending Sample Collections</h2>
      {loading ? (
        <div className="lims-loader">
          <div className="lds-dual-ring"></div>
          <span>Loading...</span>
        </div>
      ) : pending.length === 0 ? (
        <div className="lims-no-data">
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Data" />
          <p>No pending samples to collect.</p>
        </div>
      ) : (
        <div className="lims-table-responsive">
          <table className="lims-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Sample ID</th>
                <th>Tests</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(sample => (
                <tr key={sample.sampleId}>
                  <td>
                    <span className="lims-patient-avatar">
                      {sample.patient.firstName[0]}
                    </span>
                    {sample.patient.firstName} ({sample.patient.mrn})
                  </td>
                  <td>{sample.sampleNumber}</td>
                  <td>{sample.testName}</td>
                  <td>
                    <button
                      className="lims-collect-btn"
                      onClick={() => handleCollect(sample)}
                    >
                      <span role="img" aria-label="collect">🧪</span> Collect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <div className="lims-popup-overlay">
          <div className="lims-popup-content">
            <CollectSampleDialog sample={selected} onClose={handleCollected} />
            <button className="lims-popup-close" onClick={() => setSelected(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}