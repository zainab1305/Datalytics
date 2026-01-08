import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Trash2, FileText } from "lucide-react";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.email !== "your_admin_email@gmail.com") return;

    const fetchData = async () => {
      const usersRes = await axios.get("http://localhost:5001/api/admin/users");
      const uploadsRes = await axios.get("http://localhost:5001/api/admin/uploads");
      setUsers(usersRes.data);
      setUploads(uploadsRes.data);
    };
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;
    await axios.delete(`http://localhost:5001/api/admin/user/${id}`);
    setUsers(users.filter((u) => u._id !== id));
  };

  const deleteUpload = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this upload?");
    if (!confirm) return;
    await axios.delete(`http://localhost:5001/api/admin/upload/${id}`);
    setUploads(uploads.filter((u) => u._id !== id));
  };

  if (user?.email !== "your_admin_email@gmail.com") {
    return <div className="p-8 text-center text-lg text-red-600">⛔ Access Denied</div>;
  }

  return (
    <div className="min-h-screen p-8 animate-fade-in">
      <h2 className="text-5xl font-bold mb-8 text-center text-gray-800 animate-slide-up">Admin Panel</h2>

      {/* Back to Dashboard */}
      <div className="flex justify-center mb-12">
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="btn-outline"
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* USERS SECTION */}
      <div className="card mb-12 animate-slide-up max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-blue-600">
          Users ({users.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 text-gray-700">{u.email}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-2 font-medium transition-colors duration-200 hover:scale-105"
                    >
                      <span className="text-lg">🗑️</span>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOADS SECTION */}
      <div className="card animate-slide-up max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-emerald-600">
          Uploads ({uploads.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">File</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Uploaded</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">{u.fileName}</td>
                  <td className="px-6 py-4 text-gray-700">{u.userEmail}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(u.uploadTime).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteUpload(u._id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-2 font-medium transition-colors duration-200 hover:scale-105"
                    >
                      <span className="text-lg">🗑️</span>
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
  );
};

export default AdminPanel;
