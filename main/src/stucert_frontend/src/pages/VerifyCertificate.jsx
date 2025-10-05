import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { stucert_backend } from "declarations/stucert_backend";
import "./VerifyCertificate.css";

export default function VerifyCertificate() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { studentId, courseName } = state || {};
  const [verificationStatus, setVerificationStatus] = useState({
    dbChecked: false,
    dbSuccess: false,
    icpChecked: false,
    icpSuccess: false,
    finalResult: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId || !courseName) {
      navigate("/verifier");
      return;
    }

    const verify = async () => {
      try {
        // Step 1: Check Database
        setVerificationStatus((prev) => ({ ...prev, dbChecked: true }));
        const dbRes = await axios.post("http://localhost:5700/api/verifiers/verify", {
          studentId,
          courseName,
        });
        const hash = dbRes.data.hash;
        setVerificationStatus((prev) => ({ ...prev, dbSuccess: true }));

        // Step 2: Verify on Blockchain
        setVerificationStatus((prev) => ({ ...prev, icpChecked: true }));
        const isOnChain = await stucert_backend.verifyHash(hash);
        setVerificationStatus((prev) => ({
          ...prev,
          icpSuccess: isOnChain,
          finalResult: `Database: Verified | Blockchain: ${isOnChain ? "Verified" : "Not Verified"}`,
        }));
      } catch (err) {
        console.error("Verification error:", err);
        setVerificationStatus((prev) => ({
          ...prev,
          finalResult: "Verification failed.",
        }));
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [studentId, courseName, navigate]);

  return (
    <div className="verify-container">
      <header className="verify-header">
        <h1 className="verify-title">Certificate Verification</h1>
      </header>
      <main className="verify-main">
        <h2 className="course-title">Verifying: {courseName}</h2>
        <div className="verification-flow">
          <div className="step">
            <span className={`step-icon ${verificationStatus.dbChecked ? "checked" : ""}`}>
              1
            </span>
            <p className="step-text">Checking Database</p>
            {verificationStatus.dbChecked && (
              <p className="step-status">
                {verificationStatus.dbSuccess ? "Found in DB" : "DB Error"}
              </p>
            )}
          </div>
          <div className="step">
            <span className={`step-icon ${verificationStatus.icpChecked ? "checked" : ""}`}>
              2
            </span>
            <p className="step-text">Verifying on ICP</p>
            {verificationStatus.icpChecked && (
              <p className="step-status">
                {verificationStatus.icpSuccess !== null
                  ? verificationStatus.icpSuccess
                    ? "Verified"
                    : "Not Verified"
                  : "In Progress"}
              </p>
            )}
          </div>
          <div className="step">
            <span className={`step-icon ${verificationStatus.icpSuccess !== null ? "checked" : ""}`}>
              3
            </span>
            <p className="step-text">Complete Verification</p>
            {verificationStatus.finalResult && (
              <p className="step-status">{verificationStatus.finalResult}</p>
            )}
          </div>
        </div>
        {loading && <div className="loader" />}
        {!loading && (
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        )}
      </main>
    </div>
  );
}