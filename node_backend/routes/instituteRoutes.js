const express = require("express");
const router = express.Router();
const Institute = require("../models/Institute");
const Certificate = require("../models/Certificate");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const PinataSDK = require("@pinata/sdk"); // Corrected Import

// Register a new institute
router.post("/register", async (req, res) => {
  const { name, email, password, instituteId } = req.body;
  try {
    const institute = new Institute({ name, email, password, instituteId });
    await institute.save();
    res.status(201).json({
      message: "Institute registered",
      instituteId: institute.instituteId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login an institute
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const institute = await Institute.findOne({ email });
    if (!institute)
      return res.status(404).json({ message: "Institute not found" });

    const isMatch = await institute.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      instituteId: institute.instituteId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const pinata = new PinataSDK({
  pinataJWTKey: process.env.PINATA_JWT, // Corrected Property Name
  pinataGateway: process.env.GATEWAY_URL,
});

// Issue a certificate
router.post("/issue-certificate", async (req, res) => {
  const { studentName, studentId, course, date, instituteId } = req.body;
  console.log("Got Data" + JSON.stringify(req.body));

  try {
    const institute = await Institute.findOne({ instituteId });
    if (!institute)
      return res.status(404).json({ message: "You are NOT AUTHORIZED" });

    const existingCertificate = await Certificate.findOne({
      studentId,
      course,
    });
    if (existingCertificate) {
      return res.status(400).json({
        message: "Certificate already issued for this student and course",
        existingPdfUrl: existingCertificate.filePath,
      });
    }

    const fileName = `${studentId}_${course}_certificate.pdf`; // Fixed Missing Backticks
    const filePath = path.join(__dirname, "../assets/certificates", fileName);

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 50,
    });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(40).text("CERTIFICATE OF ACHIEVEMENT", { align: "center" });
    doc.moveDown().fontSize(22).text(institute.name, { align: "center" });
    doc
      .moveDown()
      .fontSize(20)
      .text("This is to certify that", { align: "center" });
    doc.moveDown().fontSize(30).text(studentName, { align: "center" });
    doc
      .moveDown()
      .fontSize(18)
      .text(`has successfully completed the ${course}`, { align: "center" }); // Fixed Missing Quotes
    doc.end();

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
    const options = {
      pinataMetadata: { name: fileName }, // Provide filename here
      pinataOptions: { cidVersion: 0 },
    };

    // Upload to Pinata
    const readableStreamForFile = fs.createReadStream(filePath);
    const upload = await pinata.pinFileToIPFS(readableStreamForFile, options);
    console.log("Uploaded" + upload.IpfsHash);

    const certificate = new Certificate({
      studentName,
      studentId,
      course,
      date,
      institute: institute._id,
      cid: upload.IpfsHash, // Corrected Property Name
    });
    await certificate.save();

    res.status(201).json({
      message: "Certificate issued",
      studentId,
      studentName,
      course,
      pdfUrl: `${process.env.GATEWAY_URL}/ipfs/${upload.IpfsHash}`, // Fixed Template Literal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all issued certificates for an institute
router.get("/certificates/:instituteId", async (req, res) => {
  const { instituteId } = req.params;

  try {
    const institute = await Institute.findOne({ instituteId });
    if (!institute)
      return res.status(404).json({ message: "Institute not found" });

    const certificates = await Certificate.find({
      institute: institute._id,
    }).sort({ date: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
