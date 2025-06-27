import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

const LabList = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/lab/all")
      .then(res => setLabs(res.data || []))
      .catch(() => setLabs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ color: "#1976d2", marginBottom: 24 }}>All Labs</h2>
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: 18,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          padding: "8px 18px",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Back
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : labs.length === 0 ? (
        <div>No labs found.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#e3f2fd" }}>
              <th style={{ padding: 8, border: "1px solid #90caf9" }}>Lab Code</th>
              <th style={{ padding: 8, border: "1px solid #90caf9" }}>Lab Name</th>
              <th style={{ padding: 8, border: "1px solid #90caf9" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {labs.map(lab => (
              <tr key={lab.code}>
                <td style={{ padding: 8, border: "1px solid #90caf9" }}>{lab.labCode}</td>
                <td style={{ padding: 8, border: "1px solid #90caf9" }}>{lab.name}</td>
                <td style={{ padding: 8, border: "1px solid #90caf9" }}>
                  <Link
                    to={`/labmaster/edit/${lab.id}`}
                    style={{ marginRight: 12, color: "#1976d2", textDecoration: "underline" }}
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/labmaster/delete/${lab.id}`}
                    style={{ color: "#d32f2f", textDecoration: "underline" }}
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LabList;