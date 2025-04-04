const express = require("express");
const router = express.Router();
const Verifier = require("../models/Verifier");
const Certificate = require("../models/Certificate");

// Register a new verifier
router.post("/register", async (req, res) => {
  const { name, email, password, organization } = req.body;
  try {
    const verifier = new Verifier({ name, email, password, organization });
    await verifier.save();
    res.status(201).json({ message: "Verifier registered", verifier });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login a verifier
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const verifier = await Verifier.findOne({ email });
    if (!verifier) return res.status(404).json({ message: "Verifier not found" });

    const isMatch = await verifier.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", verifierId: verifier._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify a certificate
router.get("/verify/:cid", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ cid: req.params.cid });
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });

    res.json({ message: "Certificate is valid", certificate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
