import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [uploadHistory, setUploadHistory] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [activePreviewId, setActivePreviewId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/analytics/history/${user.email}`);
        setUploadHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch upload history", error);
      }
    };
    fetchHistory();
  }, [user.email]);

  const fetchPreview = async (id) => {
    if (activePreviewId === id) {
      setActivePreviewId(null);
      setPreviewData(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5001/api/analytics/preview/${id}`);
      setPreviewData(res.data.preview);
      setActivePreviewId(id);
    } catch (error) {
      console.error("Failed to fetch preview", error);
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-r from-[#f3e5f5] to-[#e0c3fc] text-[#3e1f47]">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-[#6a1b9a]">Datalytics</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mb-4 bg-[#d1b3ff] hover:bg-[#c29eff] text-[#3e1f47] font-medium px-4 py-2 rounded"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/uploadFile")}
            className="w-full mb-4 bg-[#e1bee7] hover:bg-[#d7aef7] text-[#3e1f47] font-medium px-4 py-2 rounded"
          >
            Upload File
          </button>
          <button
            onClick={() => navigate("/visualization")}
            className="w-full mb-4 bg-[#f3d1f4] hover:bg-[#ecb3e5] text-[#3e1f47] font-medium px-4 py-2 rounded"
          >
            Visualize Data
          </button>
          {user?.email === "your_admin_email@gmail.com" && (
      <button
        onClick={() => navigate("/admin")}
        className="w-full mb-4 bg-[#ffcdd2] hover:bg-[#ef9a9a] text-[#3e1f47] font-medium px-4 py-2 rounded"
      >
        Admin Panel
      </button>
    )}
        </div>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-[#f48fb1] hover:bg-[#f06292] text-white font-medium px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Welcome Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-[#4a0072] mb-2">
            Welcome to Datalytics 👋
          </h2>
          <p className="text-md text-gray-700">
            Here's your recent file upload history
          </p>
        </div>

        {/* User History Section */}
        <h3 className="text-2xl font-semibold text-[#4a0072] mb-4">
          📁 User Upload History
        </h3>

        <div className="bg-white rounded-xl shadow-xl p-6 h-[70vh] overflow-y-auto">
          {uploadHistory.length === 0 ? (
            <p className="text-gray-600 text-md">No uploads yet.</p>
          ) : (
            <ul className="space-y-4">
              {uploadHistory.map((upload) => (
                <li
                  key={upload._id}
                  className="p-4 border border-[#e0c3fc] rounded-lg cursor-pointer bg-[#fdf6ff] hover:bg-[#f6ebff]"
                  onClick={() => fetchPreview(upload._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium">{upload.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(upload.uploadTime).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      Tap to preview
                    </span>
                  </div>

                  {activePreviewId === upload._id && previewData && (
                    <div className="mt-4 bg-purple-50 p-3 rounded text-sm text-gray-700">
                      <h4 className="font-semibold text-[#6a1b9a] mb-2">Preview:</h4>
                      <ul className="list-disc ml-4 space-y-1">
                        {previewData.map((line, idx) => (
                          <li key={idx}>{JSON.stringify(line)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
