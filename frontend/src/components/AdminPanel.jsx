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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-8 text-[#3e1f47]">
      <h2 className="text-4xl font-extrabold mb-6 text-center">🛠️ Admin Panel</h2>

      {/* Back to Dashboard */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="bg-purple-200 hover:bg-purple-300 text-[#3e1f47] font-medium px-6 py-2 rounded shadow"
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* USERS SECTION */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-lg mb-10">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Users ({users.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-blue-200 rounded-lg">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-blue-50 border-t border-blue-100">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
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

      {/* UPLOADS SECTION */}
      <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-green-600" />
          Uploads ({uploads.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-green-200 rounded-lg">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Uploaded</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((u) => (
                <tr key={u._id} className="hover:bg-green-50 border-t border-green-100">
                  <td className="px-4 py-2">{u.fileName}</td>
                  <td className="px-4 py-2">{u.userEmail}</td>
                  <td className="px-4 py-2">{new Date(u.uploadTime).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteUpload(u._id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
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
  );
};

export default AdminPanel;
