import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import DataContext from "./DataContext";
import { FileSpreadsheet, BarChart3, TrendingUp, Plus, ArrowRight } from "lucide-react";

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

  const recentUploads = uploadHistory.slice(0, 5);

  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 animate-slide-up">
            <h1 className="text-4xl lg:text-5xl font-bold text-color-primary mb-3">
              Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}!
            </h1>
            <p className="text-lg text-color-secondary">Transform your data into actionable insights</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12 animate-slide-up">
            {/* Total Uploads */}
            <div className="card p-6 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-xs font-medium text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded-lg">
                  {uploadHistory.length} total
                </span>
              </div>
              <p className="text-3xl font-bold text-color-primary mb-1">{uploadHistory.length}</p>
              <p className="text-sm text-color-secondary">Files uploaded</p>
            </div>

            {/* Quick Upload */}
            <button
              onClick={() => navigate("/uploadFile")}
              className="card p-6 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:border-indigo-500/50 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <Plus className="w-6 h-6 text-emerald-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-color-secondary group-hover:text-emerald-400 transition-colors" />
              </div>
              <p className="text-xl font-bold text-color-primary text-start">Upload</p>
              <p className="text-sm text-color-secondary text-start">New file</p>
            </button>

            {/* Quick Visualize */}
            <button
              onClick={() => navigate("/visualization")}
              className="card p-6 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:border-cyan-500/50 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-color-secondary group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-xl font-bold text-color-primary text-start">Visualize</p>
              <p className="text-sm text-color-secondary text-start">Charts & 3D</p>
            </button>

            {/* Insights */}
            <div className="card p-6 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-xs font-medium text-purple-400 bg-purple-500/20 px-2 py-1 rounded-lg">
                  AI Powered
                </span>
              </div>
              <p className="text-lg font-bold text-color-primary mb-1">Insights</p>
              <p className="text-sm text-color-secondary">Auto-generated</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-color-primary">Recent uploads</h2>
              {uploadHistory.length > 5 && (
                <button
                  onClick={() => navigate("/uploadFile")}
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View all →
                </button>
              )}
            </div>

            {loading ? (
              <div className="card p-12 text-center">
                <div className="w-12 h-12 border-2 border-indigo-500/50 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-color-secondary">Loading your uploads...</p>
              </div>
            ) : recentUploads.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                  <FileSpreadsheet className="w-12 h-12 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-color-primary mb-3">No uploads yet</h3>
                <p className="text-color-secondary mb-8 max-w-sm mx-auto">
                  Upload your first Excel or CSV file to start analyzing your data and getting AI-powered insights.
                </p>
                <button onClick={() => navigate("/uploadFile")} className="btn-primary inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Upload file now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentUploads.map((upload) => (
                  <div
                    key={upload._id}
                    onClick={() => fetchPreview(upload._id)}
                    className="card p-5 backdrop-blur-xl cursor-pointer hover:border-indigo-500/50 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors flex-shrink-0">
                        <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-color-primary truncate group-hover:text-indigo-400 transition-colors">
                          {upload.fileName}
                        </p>
                        <p className="text-xs text-color-secondary mt-1">
                          {new Date(upload.uploadTime).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/visualization");
                        }}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Open
                      </button>
                    </div>

                    {activePreviewId === upload._id && previewData && (
                      <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
                        <h4 className="text-xs font-semibold text-color-secondary mb-2 uppercase tracking-wide">
                          Preview
                        </h4>
                        <div className="bg-color-secondary/10 rounded-lg p-3 overflow-hidden">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {previewData.slice(0, 4).map((item, idx) => (
                              <div key={idx} className="truncate text-color-muted">
                                {typeof item === "object"
                                  ? Object.entries(item)
                                      .slice(0, 2)
                                      .map(([k, v]) => `${k}: ${v}`)
                                      .join(" • ")
                                  : String(item)}
                              </div>
                            ))}
                          </div>
                          {previewData.length > 4 && (
                            <p className="text-xs text-color-muted mt-2">
                              +{previewData.length - 4} more rows
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setData(previewData);
                            navigate("/visualization");
                          }}
                          className="mt-3 w-full text-xs font-medium py-2 px-3 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                        >
                          Visualize
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
