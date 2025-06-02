import React, {useState  ,useEffect } from "react";
import axios from "axios";
import '../../styles/tests.css';
import api from "../../api/api";
const AddTestRaised = () => {
  const [search, setSearch] = useState(""); // MRN or name input
  const [patient, setPatient] = useState(null); // Patient details after search
  const [searchError, setSearchError] = useState("");
  const [testOptions, setTestOptions] = useState([]); // <-- Master test list
  const [form, setForm] = useState({
    testName: "",
    notes: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [sampleNumber, setSampleNumber] = useState("");

const currentUser = localStorage.getItem("user") || "rohitmalviya03";
const obj = JSON.parse(currentUser);
console.log(obj.id);  // Outputs: 9
    // Fetch test master data once on mount
  useEffect(() => {
    api.get("/tests-master")
      .then(res => setTestOptions(res.data))
      .catch(() => setTestOptions([]));
  }, []);

  // Handler: search by MRN or name
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");
    setPatient(null);
    setSubmitError("");
    setSubmitSuccess("");
    setSampleNumber("");
    if (!search.trim()) {
      setSearchError("Please enter MRN or patient name.");
      return;
    }
    try {
      let res;
      if (/^\d+$/.test(search.trim())) {
        // All digits: treat as MRN
        res = await api.get(`/patients/search?mrn=${search.trim()}`);
        console.log(res.data);
        setPatient(res.data);
      } else {
        // Otherwise, search by name (picks first result)
        res = await api.get(`/patients/search?name=${encodeURIComponent(search.trim())}`);
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

  // Handler: field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitError("");
    setSubmitSuccess("");
    setSampleNumber("");
  };

  // Handler: submit test for patient
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setSampleNumber("");
    if (!patient) {
      setSubmitError("Please select a patient first.");
      return;
    }
    if (!form.testName.trim()) {
      setSubmitError("Test name is required.");
      return;
    }
    try {
      const res = await api.post("/addtests", {
        patientId: patient.id,
        testName: form.testName,
        notes: form.notes,
        testRaisedBy: obj.id, // Pass the user ID from localStorage
      });
      setSubmitSuccess("Test raised successfully!");
      setSampleNumber(res.data.sampleNumber);
      setForm({ testName: "", notes: "" });
    } catch (err) {
      setSubmitError("Failed to raise test. Please try again.");
    }
  };

  return (
    <div className="lims-container">
      <h2 className="lims-title">🧪 Raise a New Lab Test</h2>

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
          <button type="submit" className="btn" style={{ marginLeft: 10 }}>Find Patient</button>
        </div>
        {searchError && <div style={{ color: 'red', marginTop: 5 }}>{searchError}</div>}
      </form>

      {/* Patient Details */}
      {patient && (
        <div className="lims-card" style={{ marginBottom: 20 }}>
          <div><b>Patient Name:</b>  {patient.firstName}  {patient.lastName}</div>
          
          <div><b>MRN:</b> {patient.mrn}</div>
           <div><b>Registration Date :</b>  {patient.registrationDate} </div>
        </div>
      )}

      {/* Raise Test Form */}
      {patient && (
     <form className="lims-form" onSubmit={handleSubmit}>
          <div className="lims-form-group">
            <label htmlFor="testName">Select Test</label>
            <select
              id="testName"
              name="testName"
              value={form.testName}
              onChange={handleChange}
              required
              className="lims-select"
            >
              <option value="">-- Select Test --</option>
              {testOptions.map((test) => (
                <option key={test.id} value={test.testName}>
                  {test.testName}
                </option>
              ))}
            </select>
          </div>
          <div className="lims-form-group">
 
  <input type="hidden" value={obj.id} readOnly className="lims-input" />
</div>
          <div className="lims-form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any instructions..."
            />
          </div>
          <button type="submit" className="btn btn-primary">✅ Raise Test</button>
          {submitError && <div style={{ color: 'red', marginTop: 10 }}>{submitError}</div>}
          {submitSuccess && (
            <div style={{ color: 'green', marginTop: 10 }}>
              {submitSuccess}
              {sampleNumber && <div><b>Sample Number:</b> {sampleNumber}</div>}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AddTestRaised;

