import express from "express";
import User from "../models/ExcelData.js"; // your user model
import Upload from "../models/uploads.js";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Get all uploads
router.get("/uploads", async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ uploadTime: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
});

// Delete user by ID
router.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Delete upload by ID
router.delete("/upload/:id", async (req, res) => {
  try {
    await Upload.findByIdAndDelete(req.params.id);
    res.json({ message: "Upload deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete upload" });
  }
});

export default router;
