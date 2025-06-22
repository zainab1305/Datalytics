import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as XLSX from "xlsx";
import User from "../models/ExcelData.js";
import Upload from "../models/uploads.js";
import { generateSummary } from "../utils/summaryGenerator.js";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use .env in production

// ===================
// SIGNUP CONTROLLER
// ===================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Signup error", error });
  }
};

// ===================
// LOGIN CONTROLLER
// ===================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User does not exist" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login error", error });
  }
};

// ===================
// EXCEL UPLOAD CONTROLLER
// ===================
export const analyzeExcel = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log("📩 Received upload from userEmail:", req.body.userEmail || req.headers["user-email"]);

    // ✅ Save upload with preview rows
   const userEmail =
  req.body?.userEmail || req.headers["user-email"] || "unknown@example.com";

await Upload.create({
  fileName: file.originalname,
  userEmail, // ✅ now always filled
  previewRows: sheetData.slice(0, 4),
});


    res.status(200).json({
      message: "File uploaded and parsed successfully",
      data: sheetData,
    });
  } catch (error) {
    console.error("File Upload Error:", error);
    res.status(500).json({ message: "File upload error", error });
  }
};

export const deleteAllData = async (req, res) => {
  try {
    // Clear the Uploads collection (adjust model name if needed)
    await Upload.deleteMany({});
    res.status(200).json({ message: "All uploaded data deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete data", error });
  }
};
// GET all uploaded data
export const getAllData = async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ uploadTime: -1 });
    res.status(200).json(uploads);
  } catch (error) {
    console.error("Get Data Error:", error);
    res.status(500).json({ message: "Failed to retrieve data", error });
  }
};

export const getAIInsight = (req, res) => {
  try {
    const { sheetData } = req.body;
    if (!sheetData || !Array.isArray(sheetData)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const summary = generateSummary(sheetData);
    res.status(200).json({ summary });
  } catch (error) {
    console.error("AI Insight Error:", error);
    res.status(500).json({ message: "Failed to generate insight" });
  }
};
