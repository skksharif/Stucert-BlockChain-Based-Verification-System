const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Certificate = require("../models/Certificate");

// Register a new student
router.post("/register", async (req, res) => {
    const { name, studentId, email, password } = req.body;
    try {
        const student = new Student({ name, studentId, email, password });
        await student.save();
        res.status(201).json({ message: "Student registered", student });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Student login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) return res.status(404).json({ message: "Student not found" });

        const isMatch = await student.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({ message: "Login successful", studentId: student.studentId ,studentName: student.name});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch all certificates of a student
router.get("/:studentId/certificates", async (req, res) => {
    try {
        const certificates = await Certificate.find({ studentId: req.params.studentId });
        if (certificates.length === 0) {
            return res.status(404).json({ message: "No certificates found for this student" });
        }
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
