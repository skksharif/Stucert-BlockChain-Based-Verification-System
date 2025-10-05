import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Student.css";

export default function Student() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("student"));
    if (storedStudent?.studentId) {
      setStudent(storedStudent);
      fetchCertificates(storedStudent.studentId);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchCertificates = async (studentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5700/api/students/${studentId}/certificates`
      );
      setCertificates(res.data || []);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/");
  };

  return (
    <>
      <nav className="student-navbar">
        <h1 className="student-title">Welcome, {student?.studentName}</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>
      <div className="student-dashboard">
        <div className="certificates-container">
          <h2 className="section-title">Your Certificates</h2>
          {isLoading ? (
            <div className="loader" />
          ) : certificates.length === 0 ? (
            <p className="no-certificates">No certificates issued yet.</p>
          ) : (
            <div className="certificate-gallery">
              {certificates.map((cert) => (
                <div key={cert._id} className="certificate-card">
                  <h3>{cert.course}</h3>
                  <p>Date: {cert.date}</p>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${cert.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                  >
                    View/Download PDF
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
