import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/tests.css";

const RaisedTestsList = ({ patientId }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ testName: "", notes: "" });
  const [testOptions, setTestOptions] = useState([]);
  const [testSearch, setTestSearch] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [testMaster, setTestMaster] = useState({}); // { testId: testName }
  // Fetch raised tests for this patient
  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    api.get(`/raisedtests?patientId=${patientId}`)
      .then(res => setTests(res.data))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, [patientId]);

  // Fetch test master list for autosuggestion
  useEffect(() => {
    api.get("/tests-master")
      .then(res => setTestOptions(res.data || []))
      .catch(() => setTestOptions([]));
  }, []);

  const startEdit = (test) => {
    setEditId(test.id);
    setEditForm({ testName: test.testName, notes: test.notes || "" });
    setTestSearch(test.testName || "");
    setShowAutocomplete(false);
    setError(""); setSuccess("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ testName: "", notes: "" });
    setTestSearch("");
    setShowAutocomplete(false);
    setError(""); setSuccess("");
  };

  const saveEdit = async () => {
    setError(""); setSuccess("");
    try {
      await api.put(`/raisedtests/${editId}`, editForm);
      setTests(tests.map(t => t.id === editId ? { ...t, ...editForm } : t));
      setSuccess("Updated!");
      setEditId(null);
      setTestSearch("");
      setShowAutocomplete(false);
    } catch {
      setError("Failed to update. Try again.");
    }
  };

  const handleEditTestNameChange = (value) => {
    setTestSearch(value);
    setEditForm(f => ({ ...f, testName: value }));
    // Only show autocomplete if input is not empty and matches exist
    setShowAutocomplete(value.trim().length > 0 && filteredSuggestions(value).length > 0);
  };

  // Filter test name suggestions based on input
  const filteredSuggestions = (input) => {
    if (!input || !input.trim()) return [];
    return testOptions.filter(t =>
      t.testName.toLowerCase().includes(input.toLowerCase())
    );
  };

 
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
  if (!patientId) return null;

  return (
    <div className="lims-section-card">
      <div className="lims-section-header">
        <h3 className="lims-section-title">🧾 Raised Tests</h3>
      </div>
      {loading && <div>Loading...</div>}
      {!loading && tests.length === 0 && <div style={{ color: "#888" }}>No raised tests yet.</div>}
      {!loading && tests.length > 0 && (
        <div className="lims-raised-list">
          {tests.map(test =>
            <div key={test.id} className={`lims-raised-test-card${editId === test.id ? " editing" : ""}`}>
              <div className="lims-raised-test-row">
                <div className="lims-raised-test-col">
                  <span className="lims-raised-label">Sample #</span>
                  <span>{test.sampleNumber}</span>
                </div>
                <div className="lims-raised-test-col" style={{ position: "relative" }}>
                  <span className="lims-raised-label">Test</span>
                  {editId === test.id ? (
                    <>
                      <input
                        value={testSearch}
                        className="lims-raised-edit"
                        onChange={e => handleEditTestNameChange(e.target.value)}
                        onFocus={() => {
                          if (
                            testSearch.trim().length > 0 &&
                            filteredSuggestions(testSearch).length > 0
                          ) {
                            setShowAutocomplete(true);
                          }
                        }}
                        onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)}
                        placeholder="Type to search..."
                        autoComplete="off"
                      />
                      {showAutocomplete && testSearch.trim().length > 0 && filteredSuggestions(testSearch).length > 0 && (
                        <ul className="autocomplete-list" style={{
                          position: "absolute",
                          left: 0, right: 0, top: "38px", zIndex: 3
                        }}>
                          {filteredSuggestions(testSearch).slice(0, 8).map((suggestion, idx) => (
                            <li key={idx}
                              onMouseDown={() => {
                                setEditForm(f => ({ ...f, testName: suggestion.testName }));
                                setTestSearch(suggestion.testName);
                                setShowAutocomplete(false);
                              }}>
                              {suggestion.testName}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    
                      <span>{testMaster[String(test.testName)] || test.testName || test.testId}</span>
                  )}
                </div>
                <div className="lims-raised-test-col">
                  <span className="lims-raised-label">Notes</span>
                  {editId === test.id ? (
                    <input
                      value={editForm.notes}
                      className="lims-raised-edit"
                      onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                    />
                  ) : (
                    <span style={{ color: "#434" }}>{test.notes}</span>
                  )}
                </div>
                <div className="lims-raised-test-col">
                  <span className={`lims-status-pill status-${(test.status || '').toLowerCase()}`}>{test.status}</span>
                </div>
                <div className="lims-raised-test-actions">
                  {editId === test.id ? (
                    <>
                      <button className="lims-raised-btn save" onClick={saveEdit} title="Save">
                        💾
                      </button>
                      <button className="lims-raised-btn cancel" onClick={cancelEdit} title="Cancel">
                        ✖
                      </button>
                    </>
                  ) : (
                    <button className="lims-raised-btn edit" onClick={() => startEdit(test)} title="Edit">
                      ✏️
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {error && <div style={{ color: "red", marginTop: 6 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 6 }}>{success}</div>}
    </div>
  );
};

export default RaisedTestsList;