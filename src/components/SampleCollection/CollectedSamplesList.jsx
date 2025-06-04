import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/CollectedSamplesList.css";

export default function CollectedSamplesList() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(() => new Date().toISOString().slice(0, 10));
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchSamples();
    // eslint-disable-next-line
  }, [dateFilter, statusFilter, page]);

  const fetchSamples = async () => {
    setLoading(true);
    try {
      const params = {
        page: page - 1, // backend usually expects 0-based page
        size: PAGE_SIZE,
      };
      if (dateFilter) params.date = dateFilter;
      if (statusFilter !== "All") params.status = statusFilter;
      // Use /samples endpoint to allow all statuses
      const res = await api.get("/samples/collected", { params });
      if (res.data && res.data.content) {
        setSamples(res.data.content);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setSamples(res.data || []);
        setTotalPages(1);
      }
    } catch (err) {
      setSamples([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  // Handler for re-collect action
  const handleReCollect = async (sampleId) => {
    try {
       await api.put(`/samples/status`, { sampleId, status: "Pending" }); // or "Re-Collect"
      fetchSamples();
    } catch (err) {
      alert("Failed to set sample for re-collection.");
    }
  };

  // Get unique statuses for filter dropdown
  const uniqueStatuses = [
    "All",
    ...Array.from(new Set(samples.map((s) => s.status))),
  ];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="lims-card-modern">
      <h2 className="lims-title">Collected Samples (Daily)</h2>
      <div className="lims-filters-row">
        <div>
          <label>Date: </label>
          <input
            type="date"
            value={dateFilter}
            onChange={e => { setDateFilter(e.target.value); setPage(1); }}
          />
        </div>
        <div>
          <label>Status: </label>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          >
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="lims-loader">
          <div className="lds-dual-ring"></div>
          <span>Loading...</span>
        </div>
      ) : samples.length === 0 ? (
        <div className="lims-no-data">
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Data" />
          <p>No samples collected for the selected date/status.</p>
        </div>
      ) : (
        <>
          <div className="lims-table-responsive">
            <table className="lims-table">
              <thead>
                <tr>
                  <th>Sample ID</th>
                  <th>Patient</th>
                  <th>Test</th>
                  <th>Status</th>
                  <th>Collected At</th>
                  <th>Collector</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {samples.map(sample => (
                  <tr key={sample.sampleId}>
                    <td>{sample.sampleId}</td>
                    <td>
                      <span className="lims-patient-avatar">
                        {sample.patientName[0]}
                      </span>
                      {sample.patientName}
                    </td>
                    <td>{sample.tests}</td>
                    <td>
                      <span className={`lims-status-badge lims-status-${sample.status?.toLowerCase()}`}>
                        {sample.status}
                      </span>
                    </td>
                    <td>{new Date(sample.collectedAt).toLocaleString()}</td>
                    <td>{sample.collector || "-"}</td>
                    <td>
                      <button
                        className="lims-collect-btn"
                        onClick={() => handleReCollect(sample.sampleId)}
                        title="Re-Collect Sample"
                      >
                        Re-Collect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lims-pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              &laquo; Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
}