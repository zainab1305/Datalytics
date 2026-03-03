import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DataContext from "./DataContext";
import Layout from "./Layout";
import { useToast } from "../contexts/ToastContext";
import { Upload, FileSpreadsheet, Sparkles, ArrowRight } from "lucide-react";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [insight, setInsight] = useState("");
  const insightRef = useRef();
  const { setData } = useContext(DataContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (insight && insightRef.current) {
      insightRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [insight]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && /\.(xlsx|xls|csv)$/i.test(file.name)) {
      setSelectedFile(file);
    } else {
      showToast("Please drop an Excel or CSV file", "warning");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("Please select a file first", "warning");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/analytics/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "user-email": user.email,
          },
        }
      );

      const sheetData = res.data.data;
      setData(sheetData);
      showToast(res.data.message || "Upload successful!", "success");

      const aiRes = await axios.post("http://localhost:5001/api/analytics/insight", {
        sheetData,
      });
      setInsight(aiRes.data.summary);
    } catch (err) {
      console.error("Upload error:", err);
      showToast(err.response?.data?.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-10 max-w-4xl mx-auto">
        <div className="mb-10 animate-slide-up">
          <h1 className="text-3xl lg:text-4xl font-bold text-zinc-100 mb-2">
            Upload your data
          </h1>
          <p className="text-zinc-500">
            Drag & drop or select an Excel (.xlsx, .xls) or CSV file
          </p>
        </div>

        <div className="space-y-8 animate-slide-up">
          {/* Drop zone */}
          <label
            htmlFor="file-upload"
            onDragEnter={handleDrag}
            onDragLeave={() => setDragActive(false)}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              block cursor-pointer rounded-2xl border-2 border-dashed p-12 lg:p-16
              transition-all duration-300 text-center
              ${dragActive
                ? "border-indigo-500 bg-indigo-500/10"
                : selectedFile
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-white/10 hover:border-indigo-500/50 hover:bg-white/5"
              }
            `}
          >
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <div>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-xl font-semibold text-zinc-200">{selectedFile.name}</p>
                <p className="text-sm text-zinc-500 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                <p className="text-sm text-indigo-400 mt-2">Click or drop another file to replace</p>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-lg font-medium text-zinc-300 mb-1">Drop your file here</p>
                <p className="text-sm text-zinc-500">or click to browse · .xlsx, .xls, .csv</p>
              </div>
            )}
          </label>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing & generating AI insights...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Upload and get AI insight
              </>
            )}
          </button>
        </div>

        {insight && (
          <div
            ref={insightRef}
            className="card mt-12 animate-fade-in"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-100">AI insight summary</h3>
                <p className="text-sm text-zinc-500">Powered by your data</p>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {insight.replace(/\*\*/g, "")}
              </div>
            </div>
            <button
              onClick={() => navigate("/visualization")}
              className="mt-6 btn-secondary inline-flex items-center gap-2"
            >
              Proceed to visualization
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UploadFile;
