import React, { useEffect, useState } from "react";
import api, { getLabcode } from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

const SampleDetails = () => {
  const { id } = useParams();
  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/samples/${id}`, { params: { labcode: getLabcode() } })
      .then(res => setSample(res.data))
      .catch(() => setSample(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <button className="btn" onClick={() => navigate("/samples")}>Back</button>
      <h2>Sample Details</h2>
      {loading ? (
        <p>Loading...</p>
      ) : sample ? (
        <div>
          <p><strong>Sample Code:</strong> {sample.sampleCode}</p>
          <p><strong>Description:</strong> {sample.description}</p>
          <p><strong>Status:</strong> {sample.status}</p>
          <p><strong>Collected At:</strong> {sample.collectedAt}</p>
        </div>
      ) : (
        <p>Sample not found.</p>
      )}
    </div>
  );
};
export default SampleDetails;