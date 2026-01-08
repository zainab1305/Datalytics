import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExcelDataContext from "./ExcelDataContext";


const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [insight, setInsight] = useState("");
  const insightRef = useRef();
  const { setExcelData } = useContext(ExcelDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (insight && insightRef.current) {
      insightRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [insight]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) alert("✅ File uploaded successfully!");
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");

    console.log("Uploading as:", user.email);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
  "http://localhost:5001/api/analytics/upload",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      "user-email": user.email, // ✅ Send email in headers!
    },
  }
);

      const sheetData = res.data.data;
      setExcelData(sheetData);

      const aiRes = await axios.post("http://localhost:5001/api/analytics/insight", {
        sheetData,
      });

      setInsight(aiRes.data.summary);
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* Sidebar */}
      <div className="w-64 sidebar-card p-6 flex flex-col animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Datalytics</h1>
          <button onClick={() => navigate("/dashboard")} className="w-full mb-4 btn-primary">
            Home
          </button>
          <button onClick={() => navigate("/visualization")} className="w-full mb-4 btn-secondary">
            Visualize Data
          </button>
          <button onClick={() => navigate("/uploadFile")} className="w-full mb-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
            Upload File
          </button>
        </div>
      </div>

      {/* Main Upload Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-10 animate-slide-up">
        <h1 className="text-6xl font-bold mb-12 text-gray-800">
          Upload Excel File
        </h1>

        <label
          htmlFor="file-upload"
          className="cursor-pointer w-full max-w-4xl h-80 card flex items-center justify-center transition-all duration-300 hover:shadow-xl"
        >
          {selectedFile ? (
            <div className="text-center">
              <div className="text-6xl mb-6 text-blue-500">✓</div>
              <div className="text-2xl font-semibold text-gray-800">{selectedFile.name}</div>
              <div className="text-sm text-gray-500 mt-2">File selected successfully!</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-7xl mb-6 text-blue-400 animate-bounce-gentle">+</div>
              <div className="text-2xl font-medium text-gray-700 mb-2">Click to select or drop your Excel file</div>
              <div className="text-sm text-gray-500">Supported formats: .xlsx, .xls</div>
            </div>
          )}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button
          onClick={handleUpload}
          className="btn-primary text-xl px-12 py-5 mt-10"
        >
          Upload and Get AI Insight →
        </button>

        {insight && (
          <div
            ref={insightRef}
            className="card-subtle mt-12 max-w-4xl w-full animate-fade-in"
          >
            <h3 className="text-2xl font-bold mb-4 text-emerald-600">
              AI Insight Summary
            </h3>
            <div className="whitespace-pre-wrap text-base text-gray-700 leading-relaxed">
              {insight.replace(/\*\*/g, "")}
            </div>
            <button
              onClick={() => navigate("/visualization")}
              className="mt-6 btn-secondary"
            >
              Proceed to Visualization →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
