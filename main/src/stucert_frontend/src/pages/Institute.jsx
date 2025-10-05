import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Institute.css";
import { stucert_backend } from "declarations/stucert_backend";
export default function IssueCertificate() {
  const navigate = useNavigate();
  const [institute, setInstitute] = useState(null);
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    course: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("institute"));
    if (!stored || !stored.instituteId) return;

    const fetchCertificates = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5700/api/institutes/certificates/${stored.instituteId}`
        );
        setCertificates(res.data);
      } catch (err) {
        console.error("Error fetching certificates:", err);
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    try {
      const storedInstitute = JSON.parse(localStorage.getItem("institute"));
      if (storedInstitute && storedInstitute.instituteId) {
        setInstitute(storedInstitute);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to parse institute:", err);
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
    setPdfUrl("");
  };

  const validateForm = () => {
    const { studentName, studentId, course, date } = formData;
    if (!studentName.trim()) return "Student Name is required.";
    if (!studentId.trim()) return "Student ID is required.";
    if (!course.trim()) return "Course Name is required.";
    if (!date) return "Date is required.";
    return "";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5700/api/institutes/issue-certificate",
        {
          ...formData,
          date: formatDate(formData.date),
          instituteId: institute.instituteId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { hash } = response.data;
      console.log(hash);

      // Store hash on the blockchain (Motoko canister)
      const result = await stucert_backend.storeHash(hash);
      console.log(result); // Optional confirmation

      setMessage(response.data.message);
      setPdfUrl(response.data.pdfUrl || response.data.existingPdfUrl || "");
    } catch (err) {
      console.error("Error:", err);
      const resData = err.response?.data;
      setMessage(resData?.message || "Something went wrong.");
      if (resData?.existingPdfUrl) {
        setPdfUrl(resData.existingPdfUrl);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="institute-container">
      <header className="institute-header">
        <h1 className="header-title">Welcome, {institute?.instituteName}</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("institute");
            navigate("/");
          }}
        >
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="side-by-side-container">
          <section className="certificate-form-section">
            <h2 className="section-title">Issue New Certificate</h2>
            <form onSubmit={handleSubmit} className="modern-form">
              {["studentName", "studentId", "course"].map((field) => (
                <div className="input-group" key={field}>
                  <label htmlFor={field} className="input-label">
                    {field === "studentName"
                      ? "Student Name"
                      : field === "studentId"
                      ? "Student ID"
                      : field === "course"
                      ? "Course Name"
                      : "Issuance Date"}
                  </label>
                  <input
                    type={field === "date" ? "date" : "text"}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="modern-input"
                    required
                  />
                </div>
              ))}
              {error && <div className="error-text">{error}</div>}
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Issue Certificate"}
              </button>
            </form>

            {message && (
              <div className={`message-box ${pdfUrl ? "success" : "error"}`}>
                <p>{message}</p>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-link"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            )}
          </section>

          <section className="certificate-history">
            <h2 className="section-title">Certificate History</h2>
            {certificates.length === 0 ? (
              <p className="no-data">No certificates issued yet.</p>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Certificate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert, index) => (
                      <tr key={index}>
                        <td>{cert.studentName}</td>
                        <td>{cert.studentId}</td>
                        <td>{cert.course}</td>
                        <td>{cert.date}</td>
                        <td>
                          <a
                            href={`https://moccasin-rear-vulture-557.mypinata.cloud/ipfs/${cert.cid}`}
                            target="_blank"
                            rel="noreferrer"
                            className="table-link"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
