import express from "express";
import multer from "multer";
import {
  analyzeExcel,
  getAllData,
  deleteAllData,
} from "../controllers/analyticsController.js";
import Upload from "../models/uploads.js";

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route: Upload and analyze Excel
router.post("/upload", upload.single("file"), analyzeExcel);

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



export default router;
