import React, { useEffect, useState } from "react";
import { FaPlus, FaTrashAlt, FaTimes } from "react-icons/fa";
import api from "../../api/api";

const cardStyle = {
  background: "#f9fbfd",
  borderRadius: 12,
  boxShadow: "0 2px 12px #e0e0e0",
  padding: 24,
  marginBottom: 28,
  marginTop: 8,
};
const inputStyle = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1.5px solid #b0b8c1",
  fontSize: "1rem",
  background: "#fff",
};
const buttonStyle = {
  padding: "8px 18px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
};
const deleteBtnStyle = {
  background: "none",
  border: "none",
  color: "#e74c3c",
  cursor: "pointer",
  fontSize: 18,
  marginLeft: 10,
};

export default function TestGroupMaster() {
  const [groups, setGroups] = useState([]);
  const [tests, setTests] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  useEffect(() => {
    fetchGroups();
    fetchTests();
  }, []);

  const fetchGroups = async () => {
    const res = await api.get("/masters/test-groups");
    setGroups(res.data);
  };
  const fetchTests = async () => {
    const res = await api.get("/masters/tests");
    setTests(res.data);
  };

  const addGroup = async () => {
    if (!groupName.trim() || selectedTests.length === 0) {
      setAlert({ show: true, type: "error", msg: "All fields required." });
      return;
    }
    try {
      await api.post("/masters/test-groups", {
        name: groupName.trim(),
        testIds: selectedTests,
      });
      setGroupName("");
      setSelectedTests([]);
      setAlert({ show: true, type: "success", msg: "Group added!" });
      fetchGroups();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error adding group." });
    }
  };

  const deleteGroup = async id => {
    try {
      await api.delete(`/masters/test-groups/${id}`);
      setAlert({ show: true, type: "success", msg: "Group deleted." });
      fetchGroups();
    } catch {
      setAlert({ show: true, type: "error", msg: "Error deleting group." });
    }
  };

  return (
    <section style={cardStyle}>
      <h3 style={{ marginBottom: 18, color: "#1953a8" }}>Test Group Master</h3>
      {alert.show && (
        <div
          style={{
            background: alert.type === "error" ? "#ffeaea" : "#e6f9ed",
            color: alert.type === "error" ? "#c0392b" : "#197d4b",
            border: `1.5px solid ${alert.type === "error" ? "#e74c3c" : "#27ae60"}`,
            borderRadius: 8,
            padding: "12px 18px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          <span>{alert.msg}</span>
          <button
            onClick={() => setAlert({ ...alert, show: false })}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            <FaTimes />
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <input
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          placeholder="Group Name"
          style={inputStyle}
        />
        <select
          multiple
          value={selectedTests}
          onChange={e => setSelectedTests(Array.from(e.target.selectedOptions, o => o.value))}
          style={{ ...inputStyle, minWidth: 180, height: 40 }}
        >
          {tests.map(t => (
            <option key={t.id || t._id} value={t.id || t._id}>
              {t.name || t.testName}
            </option>
          ))}
        </select>
        <button onClick={addGroup} style={buttonStyle}>
          <FaPlus /> Add Group
        </button>
      </div>
      <div
        style={{
          overflowX: "auto",
          borderRadius: 14,
          boxShadow: "0 2px 16px #e0e0e0",
          background: "#fff",
          marginTop: 12,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            borderRadius: 14,
            overflow: "hidden",
            fontFamily: "inherit",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f4f7fb",
                color: "#1953a8",
                position: "sticky",
                top: 0,
                zIndex: 2,
              }}
            >
              <th style={{ padding: "14px 10px" }}>Group Name</th>
              <th style={{ padding: "14px 10px" }}>Tests</th>
              <th style={{ padding: "14px 10px" }}></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g, idx) => (
              <tr key={g.id || g._id} style={{ background: idx % 2 === 0 ? "#f9fbfd" : "#f5f7fa" }}>
                <td>{g.name}</td>
                <td>
                  {(g.tests || []).map(t => t.name || t.testName).join(", ")}
                </td>
                <td>
                  <button onClick={() => deleteGroup(g.id || g._id)} style={deleteBtnStyle} title="Delete">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}