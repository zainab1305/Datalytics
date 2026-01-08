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
    <div className="h-screen flex animate-fade-in">
      {/* Sidebar */}
      <div className="w-64 sidebar-card p-6 flex flex-col justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Datalytics</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mb-4 btn-primary"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/uploadFile")}
            className="w-full mb-4 btn-secondary"
          >
            Upload File
          </button>
          <button
            onClick={() => navigate("/visualization")}
            className="w-full mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            Visualize Data
          </button>
          {user?.email === "your_admin_email@gmail.com" && (
      <button
        onClick={() => navigate("/admin")}
        className="w-full mb-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
      >
        Admin Panel
      </button>
    )}
        </div>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Welcome Header */}
        <div className="mb-12 animate-slide-up">
          <h2 className="text-5xl font-bold text-slate-800 mb-4 text-shadow">
            Welcome to Datalytics
          </h2>
          <p className="text-lg text-slate-600">
            Here's your recent file upload history
          </p>
        </div>

        {/* User History Section */}
        <h3 className="text-3xl font-semibold text-slate-800 mb-6 text-shadow animate-slide-up">
          Upload History
        </h3>

        <div className="card h-[70vh] overflow-y-auto animate-slide-up">
          {uploadHistory.length === 0 ? (
            <p className="text-gray-600 text-lg">No uploads yet.</p>
          ) : (
            <ul className="space-y-6">
              {uploadHistory.map((upload) => (
                <li
                  key={upload._id}
                  className="p-6 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-white transform transition-all duration-300 hover:shadow-md"
                  onClick={() => fetchPreview(upload._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xl font-semibold text-gray-800">{upload.fileName}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(upload.uploadTime).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium shadow-sm">
                      Tap to preview
                    </span>
                  </div>

                  {activePreviewId === upload._id && previewData && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-gray-700 animate-fade-in">
                      <h4 className="font-bold text-blue-800 mb-3 text-lg">Preview:</h4>
                      <ul className="list-disc ml-6 space-y-2">
                        {previewData.map((line, idx) => (
                          <li key={idx} className="text-gray-700">{JSON.stringify(line)}</li>
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
