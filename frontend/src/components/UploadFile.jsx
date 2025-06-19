import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const user = JSON.parse(localStorage.getItem("user")) || {};
import ExcelDataContext from "./ExcelDataContext";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { setExcelData } = useContext(ExcelDataContext);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) alert("✅ File uploaded successfully!");
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://localhost:5001/api/analytics/upload", formData);
      setExcelData(res.data.data);
      navigate("/visualization");
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-[#f3e5f5] to-[#e0c3fc] text-[#3e1f47]">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6 flex flex-col">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-[#6a1b9a]">Datalytics</h1>
          <button onClick={() => navigate("/dashboard")} className="w-full mb-4 bg-[#d1b3ff] hover:bg-[#c29eff] text-[#3e1f47] font-medium px-4 py-2 rounded">
            Home
          </button>
          <button onClick={() => navigate("/visualization")} className="w-full mb-4 bg-[#e1bee7] hover:bg-[#d7aef7] text-[#3e1f47] font-medium px-4 py-2 rounded">
            Visualize Data
          </button>
          <button onClick={() => navigate("/uploadFile")} className="w-full mb-4 bg-[#f3d1f4] hover:bg-[#ecb3e5] text-[#3e1f47] font-medium px-4 py-2 rounded">
            Upload File
          </button>
          
        </div>
      </div>

      {/* Main Upload Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <h1 className="text-5xl font-extrabold mb-10 text-[#3e1f47]">Upload Excel File</h1>

        <label
          htmlFor="file-upload"
          className="cursor-pointer w-full max-w-4xl h-64 bg-white border-4 border-dashed border-[#9c27b0] rounded-xl flex items-center justify-center text-2xl font-semibold text-[#9c27b0] hover:bg-[#f5ebfb] transition mb-8 shadow-lg"
        >
          {selectedFile ? selectedFile.name : "Click to select or drop your Excel file"}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button
          onClick={handleUpload}
          className="bg-[#9c27b0] hover:bg-[#8e24aa] text-white font-semibold px-10 py-4 rounded-xl shadow-xl text-lg transition"
        >
          Upload and Visualize →
        </button>
      </div>
    </div>
  );
};

export default UploadFile;
