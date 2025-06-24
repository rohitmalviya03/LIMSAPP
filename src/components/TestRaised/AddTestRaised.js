import React, { useState, useEffect } from "react";
import api from "../../api/api";
import RaisedTestsList from "./RaisedTestsList";
import "../../styles/tests.css";


import { useAuth } from "../../context/AuthContext";
const AddTestRaised = () => {
  const [search, setSearch] = useState(""); // MRN or name input
  const [patient, setPatient] = useState(null); // Patient details after search
  const [searchError, setSearchError] = useState("");
  const [testOptions, setTestOptions] = useState([]); // Master test list
  const [autocomplete, setAutocomplete] = useState([]); // Suggestions for test search
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]); // [{id, testName}]
  const [testSearch, setTestSearch] = useState(""); // Test search input

  const [notes, setNotes] = useState(""); // single notes for all tests
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [sampleNumbers, setSampleNumbers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get logged-in user object from localStorage (assume it's stored as JSON string)
  const userStr = localStorage.getItem("user") || '{"id":"rohitmalviya03"}';
  let obj = {};
  try {
    obj = JSON.parse(userStr);
  } catch (err) {
    obj = { id: "rohitmalviya03" };
  }
  const { getLabcode } = useAuth();
const labcode = getLabcode(); // Get labcode from context
  // Fetch test master data once on mount
  useEffect(() => {
    api.get(`/tests-master?labcode=`+labcode)
      .then(res => setTestOptions(res.data))
      .catch(() => setTestOptions([]));
  }, []);

  // Autocomplete filtering for test search
  useEffect(() => {
    if (!testSearch.trim()) {
      setAutocomplete([]);
      setShowAutocomplete(false);
    } else {
      const filtered = testOptions.filter(
        t =>
          t.testName.toLowerCase().includes(testSearch.toLowerCase()) &&
          !selectedTests.some(sel => sel.id === t.id)
      );
      setAutocomplete(filtered);
      setShowAutocomplete(filtered.length > 0);
    }
  }, [testSearch, testOptions, selectedTests]);

  // Handler: search by MRN or name
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");
    setPatient(null);
    setSubmitError("");
    setSubmitSuccess("");
    setSampleNumbers([]);
    if (!search.trim()) {
      setSearchError("Please enter MRN or patient name.");
      return;
    }
    try {
      let res;
      if (/^\d+$/.test(search.trim())) {
        // All digits: treat as MRN
        res = await api.get(`/patients/search?mrn=${search.trim()}&labcode=`+labcode);
        setPatient(res.data);
      } else {
        // Otherwise, search by name (picks first result)
        res = await api.get(`/patients/search?name=${encodeURIComponent(search.trim())}&labcode=`+labcode);
        if (res.data.length === 0) {
          setSearchError("No patient found.");
        } else {
          setPatient(res.data[0]);
        }
      }
    } catch (err) {
      setSearchError("Patient not found.");
    }
  };

  // Handler: change in test search input
  const handleTestSearchChange = (e) => {
    setTestSearch(e.target.value);
    setShowAutocomplete(true);
    setSubmitError("");
    setSubmitSuccess("");
    setSampleNumbers([]);
  };

  // Handler: select test from autocomplete
  const handleSelectTest = (test) => {
    setSelectedTests([
      ...selectedTests,
      { id: test.id, testName: test.testName }
    ]);
    setTestSearch("");
    setAutocomplete([]);
    setShowAutocomplete(false);
    setSubmitError("");
    setSubmitSuccess("");
    setSampleNumbers([]);
  };

  // Handler: remove a selected test
  const handleRemoveTest = (idx) => {
    setSelectedTests(selectedTests.filter((_, i) => i !== idx));
    setSubmitError("");
    setSubmitSuccess("");
    setSampleNumbers([]);
  };

  // Handler: notes change (single textarea)
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    setSubmitError("");
    setSubmitSuccess("");
    setSampleNumbers([]);
  };

  // Handler: submit all selected tests
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setSampleNumbers([]);
    if (!patient) {
      setSubmitError("Please select a patient first.");
      return;
    }
    if (selectedTests.length === 0) {
      setSubmitError("Please add at least one test.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/addtests/bulk", {
        patientId: patient.id,
        testRaisedBy: obj.id,
        labcode: labcode, // Use labcode from context
        tests: selectedTests.map(test => ({ testId: test.id })), // [{testId}]
        notes // send notes for all
      });
      setSubmitSuccess("All tests raised successfully!");
      setSampleNumbers(res.data.sampleNumbers || []);
      setSelectedTests([]);
      setNotes("");
    } catch {
      setSubmitError("Failed to raise tests. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="lims-container">
      <h2 className="lims-title">🧪 Raise New Lab Test(s)</h2>

      {/* Patient Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <div className="lims-form-group">
          <label>Enter Patient MRN or Name</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="e.g. 12345 or John"
            style={{ maxWidth: 350 }}
          />
          <button type="submit" className="btn" style={{ marginLeft: 10 }}>
            Find Patient
          </button>
        </div>
        {searchError && <div style={{ color: "red", marginTop: 5 }}>{searchError}</div>}
      </form>

      {/* Patient Details */}
      {patient && (
        <div className="lims-card" style={{ marginBottom: 20 }}>
          <div>
            <b>Patient Name:</b> {patient.firstName} {patient.lastName}
          </div>
          <div>
            <b>MRN:</b> {patient.mrn}
          </div>
          <div>
            <b>Registration Date :</b> {patient.registrationDate}
          </div>
        </div>
      )}

      {/* Raise Test Form */}
      {patient && (
        <form className="lims-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="lims-form-group" style={{ position: "relative" }}>
            <label htmlFor="testName">Add Test</label>
            <input
              id="testName"
              name="testName"
              value={testSearch}
              onChange={handleTestSearchChange}
              placeholder="Type to search test name..."
              className="lims-input"
              autoComplete="off"
              onFocus={() => setShowAutocomplete(autocomplete.length > 0)}
              onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
            />
            {showAutocomplete && (
              <ul className="autocomplete-list">
                {autocomplete.map(test => (
                  <li
                    key={test.id}
                    onClick={() => handleSelectTest(test)}
                  >
                    {test.testName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Selected Tests Pills */}
          {selectedTests.length > 0 && (
            <div className="lims-selected-tests" style={{ margin: "8px 0 18px 0" }}>
              <label style={{ display: "block", marginBottom: 5, fontWeight: 600 }}>Tests to Raise:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {selectedTests.map((test, idx) => (
                  <span
                    key={test.id}
                    className="lims-pill"
                  >
                    {test.testName}
                    <button
                      type="button"
                      className="lims-pill-remove"
                      onClick={() => handleRemoveTest(idx)}
                      title="Remove"
                    >✖</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes section (single textarea for all tests) */}
          <div className="lims-form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={handleNotesChange}
              rows={3}
              placeholder="Any instructions (will apply to all tests)..."
            />
          </div>

          <input type="hidden" value={obj.id} readOnly className="lims-input" />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="mini-spinner"></span> : "✅ Raise All Tests"}
          </button>
          {submitError && (
            <div style={{ color: "red", marginTop: 10 }}>{submitError}</div>
          )}
          {submitSuccess && (
            <div style={{ color: "green", marginTop: 10 }}>
              {submitSuccess}
              {sampleNumbers.length > 0 && (
                <div>
                  <b>Sample Numbers:</b> {sampleNumbers.join(", ")}
                </div>
              )}
            </div>
          )}
        </form>
      )}

      {/* Raised tests table with edit */}
      <RaisedTestsList patientId={patient && patient.id} />
    </div>
  );
};

export default AddTestRaised;