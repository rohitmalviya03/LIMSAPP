import React, { useState, useEffect } from "react";
import api, { getLabcode } from "../../api/api";

export default function ResultEntryDialog({ sample, onClose }) {
  const [results, setResults] = useState({});
  const [saving, setSaving] = useState(false);
  const [testParams, setTestParams] = useState({});
  const [testNames, setTestNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userStr = localStorage.getItem("user") || '{"id":"rohitmalviya03"}';
  let obj = {};
  try {
    obj = JSON.parse(userStr);
  } catch (err) {
    obj = { id: "rohitmalviya03" };
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      const testIds = String(sample.tests).split(",").map(id => id.trim());
      try {
        const dataArr = await Promise.all(
          testIds.map(async testId => {
            const [paramsRes, nameRes] = await Promise.all([
              api.get(`/masters/machine-test-params`, { params: { testId, labcode: getLabcode() } }),
              api.get(`/masters/tests/${testId}`, { params: { labcode: getLabcode() } })
            ]);
            return {
              testId,
              params: paramsRes.data || [],
              name: nameRes.data?.testName || `Test ${testId}`
            };
          })
        );
        const paramsObj = {};
        const namesObj = {};
        dataArr.forEach(({ testId, params, name }) => {
          paramsObj[testId] = params;
          namesObj[testId] = name;
        });
        setTestParams(paramsObj);
        setTestNames(namesObj);
      } catch (err) {
        setError("Failed to load test data.");
      }
      setLoading(false);
    };
    fetchData();
  }, [sample.tests]);

  const handleChange = (key, value) => {
    setResults(r => ({ ...r, [key]: value }));
  };

  const handleSave = async () => {
    // Validation: all visible fields must be filled
    const missing = Object.keys(testNames).some(testId =>
      testParams[testId] && testParams[testId].length > 0
        ? testParams[testId].some(param => !results[`${testId}_${param.parameter}`])
        : !results[testId]
    );
    if (missing) {
      setError("Please fill all result fields.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await api.post("/results/entry", {
        sample,
        results,
        userId: obj.id,
        labcode: getLabcode(),
      });
      onClose();
    } catch (err) {
      setError("Failed to save results.");
    }
    setSaving(false);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        padding: 32,
        minWidth: 420,
        maxWidth: 700,
        width: "90%",
        maxHeight: "80vh", // Add this for dialog max height
        display: "flex",
        flexDirection: "column"
      }}>
        <h2 style={{ marginBottom: 24, color: "#1976d2" }}>
          Enter Results for Sample <span style={{ color: "#333" }}>#{sample.sampleId}</span>
        </h2>
        <div style={{
          flex: 1,
          overflowY: "auto", // Make table area scrollable
          marginBottom: 24
        }}>
          {loading ? (
            <div style={{ padding: 24, textAlign: "center" }}>Loading test details...</div>
          ) : error ? (
            <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
          ) : (
            <table style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              background: "#fafbfc",
              borderRadius: 8,
              overflow: "hidden"
            }}>
              <thead>
                <tr style={{ background: "#f0f4f8" }}>
                  <th style={{ textAlign: "left", padding: "12px 8px", borderBottom: "2px solid #e0e0e0" }}>Test Name</th>
                  <th style={{ textAlign: "left", padding: "12px 8px", borderBottom: "2px solid #e0e0e0" }}>Parameter</th>
                  <th style={{ textAlign: "left", padding: "12px 8px", borderBottom: "2px solid #e0e0e0" }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(testNames).map(testId => (
                  testParams[testId] && testParams[testId].length > 0 ? (
                    testParams[testId].map(param => (
                      <tr key={`${testId}_${param.parameter}`}>
                        <td style={{ padding: "10px 8px", borderBottom: "1px solid #f0f0f0" }}>{testNames[testId]}</td>
                        <td style={{ padding: "10px 8px", borderBottom: "1px solid #f0f0f0" }}>
                          {param.parameter}{param.unit ? ` (${param.unit})` : ""}
                        </td>
                        <td style={{ padding: "10px 8px", borderBottom: "1px solid #f0f0f0" }}>
                          <input
                            type="text"
                            value={results[`${testId}_${param.parameter}`] || ""}
                            onChange={e => handleChange(`${testId}_${param.parameter}`, e.target.value)}
                            placeholder="Enter result"
                            style={{
                              width: 140,
                              padding: "6px 10px",
                              border: "1px solid #bdbdbd",
                              borderRadius: 6,
                              fontSize: 15
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={testId}>
                      <td style={{ padding: "10px 8px", borderBottom: "1px solid #f0f0f0" }}>{testNames[testId]}</td>
                      <td style={{ padding: "10px 8px", borderBottom: "1px solid #f0f0f0" }}>Result</td>
                      <td style={{ padding: "10px 8px", borderBottom: "1px solid #f0f0f0" }}>
                        <input
                          type="text"
                          value={results[testId] || ""}
                          onChange={e => handleChange(testId, e.target.value)}
                          placeholder="Enter result"
                          style={{
                            width: 140,
                            padding: "6px 10px",
                            border: "1px solid #bdbdbd",
                            borderRadius: 6,
                            fontSize: 15
                          }}
                        />
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || loading}
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 24px",
              fontWeight: 500,
              fontSize: 16,
              cursor: saving || loading ? "not-allowed" : "pointer"
            }}
          >
            {saving ? "Saving..." : "Save Results"}
          </button>
          <button
            className="btn"
            onClick={onClose}
            disabled={saving || loading}
            style={{
              background: "#e0e0e0",
              color: "#333",
              border: "none",
              borderRadius: 6,
              padding: "10px 24px",
              fontWeight: 500,
              fontSize: 16,
              cursor: saving || loading ? "not-allowed" : "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}