import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import DataContext from "./DataContext";
import { FileSpreadsheet, BarChart3, Clock, ChevronDown, ChevronUp } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setData } = useContext(DataContext);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [activePreviewId, setActivePreviewId] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/analytics/history/${user.email}`);
        setUploadHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch upload history", error);
      } finally {
        setLoading(false);
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
    <Layout>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <div className="mb-10 animate-slide-up">
          <h1 className="text-3xl lg:text-4xl font-bold text-zinc-100 mb-2">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-zinc-500">Here's your recent file upload history</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-slide-up">
          <div className="card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{uploadHistory.length}</p>
              <p className="text-sm text-zinc-500">Total uploads</p>
            </div>
          </div>
          <div
            onClick={() => navigate("/uploadFile")}
            className="card p-6 flex items-center gap-4 cursor-pointer hover:border-indigo-500/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-zinc-200">Upload new file</p>
              <p className="text-sm text-zinc-500">Excel, CSV supported</p>
            </div>
          </div>
          <div
            onClick={() => navigate("/visualization")}
            className="card p-6 flex items-center gap-4 cursor-pointer hover:border-indigo-500/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="font-semibold text-zinc-200">Visualize data</p>
              <p className="text-sm text-zinc-500">Charts & 3D views</p>
            </div>
          </div>
        </div>

        {/* Upload History */}
        <div className="animate-slide-up">
          <h2 className="text-xl font-bold text-zinc-200 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-500" />
            Upload history
          </h2>

          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 border-2 border-indigo-500/50 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-zinc-500">Loading your uploads...</p>
              </div>
            ) : uploadHistory.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-6">
                  <FileSpreadsheet className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">No uploads yet</h3>
                <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
                  Upload your first Excel or CSV file to get started with AI insights and visualizations.
                </p>
                <button onClick={() => navigate("/uploadFile")} className="btn-primary">
                  Upload your first file
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {uploadHistory.map((upload) => (
                  <li
                    key={upload._id}
                    onClick={() => fetchPreview(upload._id)}
                    className="p-6 cursor-pointer hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                          <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-200">{upload.fileName}</p>
                          <p className="text-sm text-zinc-500">
                            {new Date(upload.uploadTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-sm text-indigo-400 font-medium">
                        {activePreviewId === upload._id ? (
                          <>Hide preview <ChevronUp className="w-4 h-4" /></>
                        ) : (
                          <>View preview <ChevronDown className="w-4 h-4" /></>
                        )}
                      </span>
                    </div>

                    {activePreviewId === upload._id && previewData && (
                      <div className="mt-6 p-4 rounded-xl bg-zinc-800/50 border border-white/5 animate-fade-in">
                        <h4 className="font-semibold text-zinc-400 mb-3 text-sm">Data preview</h4>
                        <div className="overflow-x-auto">
                          <pre className="text-sm text-zinc-400 font-mono">
                            {previewData.slice(0, 5).map((line, idx) => (
                              <div key={idx}>{JSON.stringify(line)}</div>
                            ))}
                            {previewData.length > 5 && (
                              <div className="text-zinc-500 mt-2">... and {previewData.length - 5} more rows</div>
                            )}
                          </pre>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setData(previewData);
                            navigate("/visualization");
                          }}
                          className="mt-4 btn-secondary text-sm py-2 px-4"
                        >
                          Visualize this data
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
