import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Verifier.css";

export default function Verifier() {
  const [studentId, setStudentId] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!studentId.trim()) {
      setError("Please enter a valid student ID");
      return;
    }

    setLoading(true);
    setError("");
    setCertificates([]);

    try {
      const res = await axios.get(
        `http://localhost:5700/api/verifiers/${studentId}/certificates`
      );
      setCertificates(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No certificates found for this student ID.");
      } else {
        setError("An error occurred while fetching certificates. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateVerify = (courseName) => {
    navigate("/verify-certificate", {
      state: { studentId, courseName },
    });
  };

  return (
    <div className="verifier-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Certificate Verifier</h2>
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            aria-label="Student ID"
            className="modern-input"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className="modern-button"
          >
            {loading ? "Verifying..." : "Fetch Certificates"}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </aside>
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Certificates Dashboard</h1>
        </header>
        {loading && <div className="modern-spinner"></div>}
        {certificates.length > 0 && (
          <div className="certificates-grid">
            {certificates.map((cert) => (
              <div key={cert._id || cert.certificateId} className="certificate-card">
                <div className="card-content">
                  <h3>{cert.course || "Unnamed Certificate"}</h3>
                  <p className="cert-date">Date: {cert.date || "Not specified"}</p>
                  <div className="card-actions">
                    <a
                      href={
                        cert.certificateURL ||
                        `https://gateway.pinata.cloud/ipfs/${cert.cid}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-button"
                    >
                      View PDF
                    </a>
                    <button
                      className="verify-button"
                      onClick={() => handleCertificateVerify(cert.course)}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && certificates.length === 0 && !error && (
          <p className="no-data-message">Enter a Student ID to view certificates</p>
        )}
      </main>
    </div>
  );
}