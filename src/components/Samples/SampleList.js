import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

const getLabcode = () => {
  // Fetch hospital/lab code from sessionStorage (set at login)
  return sessionStorage.getItem("labcode") || "";
};

const SampleList = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const labcode = getLabcode();
    api.get(`/samples`, { params: { labcode } })
      .then(res => setSamples(res.data))
      .catch(() => setSamples([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Samples</h2>
      <Link to="/samples/add" className="btn">Add Sample</Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-custom">
          <thead>
            <tr>
              <th>Sample Code</th>
              <th>Description</th>
              <th>Status</th>
              <th>Collected At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {samples.map(sample => (
              <tr key={sample.sampleID}>
                <td>{sample.sampleCode}</td>
                <td>{sample.description}</td>
                <td>{sample.status}</td>
                <td>{sample.collectedAt}</td>
                <td>
                  <Link to={`/samples/${sample.sampleID}`} className="btn">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default SampleList;