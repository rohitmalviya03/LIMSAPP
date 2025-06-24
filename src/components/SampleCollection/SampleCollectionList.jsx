import React, { useEffect, useState } from "react";
import CollectSampleDialog from "./CollectSampleDialog";
import api from "../../api/api";
import "../../styles/SampleCollectionList.css";

import { useAuth } from "../../context/AuthContext";
const ROWS_PER_PAGE = 10;
export default function SampleCollectionList() {
  const [pending, setPending] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testOptions, setTestOptions] = useState([]);
  const { getLabcode } = useAuth();
const labcode = getLabcode(); // Get labcode from context
  const [testMaster, setTestMaster] = useState({}); // { testId: testName }
  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line
  }, []);


   useEffect(() => {
   const res= api.get(`/tests-master?labcode=`+labcode)
      .then(res => setTestOptions(res.data || []))
      .catch(() => setTestOptions([]));
  
    }, []);
  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/samples/pending?labcode="+labcode);
      console.log("SampleCollectionList - pending samples:", res.data);
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

  // Fetch test master list and build a map {id: name}
  useEffect(() => {
    api.get(`/tests-master?labcode=`+labcode)
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

  // Pagination state
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(pending.length / ROWS_PER_PAGE);

  // Paginated data
  const paginatedPending = pending.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );
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
              {paginatedPending.map(sample => (
                <tr
                  key={sample.sampleId}
                  className={sample.status === "Re-collect" ? "recollected-row" : ""}
                >
                  <td>
                    <span className="lims-patient-avatar">
                      {sample.patient.firstName[0]}
                    </span>
                    {sample.patient.firstName} ({sample.patient.mrn})
                  </td>
                  <td>{sample.sampleNumber}</td>
                  <td>
                    {String(sample.testName)
                      .split(",")
                      .map(id => testMaster[String(id.trim())] || id)
                      .join(", ")}
                  </td>
                  <td>
                    {sample.billed ? (
                      <button
                        className="lims-collect-btn"
                        onClick={() => handleCollect(sample)}
                      >
                        <span role="img" aria-label="collect">🧪</span> Collect
                      </button>
                    ) : (
                      <span style={{ color: "#c00", fontWeight: 500 }}>
                        Billing not done yet
                      </span>
                    )}
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

      {/* Pagination Controls */}
      <div style={{ display: "flex", justifyContent: "center", margin: "18px 0" }}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ marginRight: 8 }}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{ marginLeft: 8 }}
        >
          Next
        </button>
      </div>

      {/* Color Code Legend */}
      <div style={{
        marginTop: 18,
        background: "#fffbe6",
        color: "#d48806",
        border: "1px solid #ffe58f",
        borderRadius: 6,
        padding: "10px 18px",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 500
      }}>
        <span style={{
          display: "inline-block",
          width: 18,
          height: 18,
          background: "#fffbe6",
          border: "2px solid #ffe58f",
          borderRadius: 4,
          marginRight: 6
        }}></span>
        Re-collected Sample
      </div>
    </div>
  );
}