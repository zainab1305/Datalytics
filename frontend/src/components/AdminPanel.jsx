import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Trash2, FileText, Shield, ArrowLeft } from "lucide-react";
import Layout from "./Layout";
import { useToast } from "../contexts/ToastContext";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (user?.email !== "your_admin_email@gmail.com") return;

    const fetchData = async () => {
      try {
        const [usersRes, uploadsRes] = await Promise.all([
          axios.get("http://localhost:5001/api/admin/users"),
          axios.get("http://localhost:5001/api/admin/uploads"),
        ]);
        setUsers(usersRes.data);
        setUploads(uploadsRes.data);
      } catch (err) {
        showToast("Failed to load admin data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.email]);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5001/api/admin/user/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      showToast("User deleted", "success");
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  const deleteUpload = async (id) => {
    if (!window.confirm("Delete this upload? This cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5001/api/admin/upload/${id}`);
      setUploads((prev) => prev.filter((u) => u._id !== id));
      showToast("Upload deleted", "success");
    } catch {
      showToast("Failed to delete upload", "error");
    }
  };

  if (user?.email !== "your_admin_email@gmail.com") {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="card text-center p-12 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Access denied</h2>
            <p className="text-zinc-500 mb-6">You don't have permission to view this page.</p>
            <button onClick={() => navigate("/dashboard")} className="btn-primary">
              Back to dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10 animate-slide-up">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">Admin panel</h1>
            <p className="text-zinc-500">Manage users and uploads</p>
          </div>
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <div className="w-12 h-12 border-2 border-indigo-500/50 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-500">Loading...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-slide-up">
            {/* Users */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Users ({users.length})</h3>
                  <p className="text-sm text-zinc-500">Registered accounts</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">Email</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-zinc-200">{u.name}</td>
                        <td className="px-6 py-4 text-zinc-400">{u.email}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Uploads */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Uploads ({uploads.length})</h3>
                  <p className="text-sm text-zinc-500">File upload history</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">File</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">Uploaded</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map((u) => (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-zinc-200">{u.fileName}</td>
                        <td className="px-6 py-4 text-zinc-400">{u.userEmail}</td>
                        <td className="px-6 py-4 text-zinc-500 text-sm">{new Date(u.uploadTime).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteUpload(u._id)}
                            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPanel;
