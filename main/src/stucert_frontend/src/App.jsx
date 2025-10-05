import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Verifier from "./pages/Verifier";
import StudentLogin from "./components/StudentLogin";
import InstituteLogin from "./components/InstituteLogin";
import Institute from "./pages/Institute";
import Student from "./pages/Student";
import VerifyCertificate from "./pages/VerifyCertificate";
function App() {
  return (
    <>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/student-dashboard" element={<Student/>} />
           
            <Route path="/verifier" element={<Verifier />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />

            <Route path="/institute-login" element={<InstituteLogin/>} />
            <Route path="/institute" element={<Institute/>} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
