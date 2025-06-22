import express from "express";
import multer from "multer";
import {
  analyzeExcel,
  getAllData,
  deleteAllData,
} from "../controllers/analyticsController.js";
import { generateSummary } from "../utils/summaryGenerator.js";
import Upload from "../models/uploads.js";

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route: Upload and analyze Excel
router.post("/upload", upload.single("file"), (req, res, next) => {
  console.log("➡️ Received userEmail:", req.body.userEmail); // ✅ Debug
  analyzeExcel(req, res); // hand off
});

// GET route: Retrieve all stored analyzed data
router.get("/data", getAllData);

// DELETE route: Delete all stored data
router.delete("/data", deleteAllData);

// ✅ NEW GET route: Fetch upload history by user email
router.get("/history/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const uploads = await Upload.find({ userEmail: email }).sort({ uploadTime: -1 });
    res.json(uploads);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Failed to fetch upload history" });
  }
});
// Add to analyticsRoutes.js
router.get("/preview/:id", async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.json({ preview: file.previewRows }); // ✅ real preview
  } catch (err) {
    console.error("Preview fetch error:", err);
    res.status(500).json({ message: "Failed to get preview" });
  }
});

router.post("/insight", async (req, res) => {
  try {
    const { sheetData } = req.body;
    if (!sheetData || !Array.isArray(sheetData)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Call our helper
    const summary = generateSummary(sheetData);
    res.json({ summary });
  } catch (err) {
    console.error("AI Insight Error:", err);
    res.status(500).json({ message: "Failed to generate insight" });
  }
});

export default router;
