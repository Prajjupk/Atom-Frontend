import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const load = async () => {
    try {
      const { data } = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
    } catch (e) {
      console.error("Error loading tasks:", e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(
        `/tasks/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      load();
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  const handleFileUpload = async (taskId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      await api.post(`/tasks/${taskId}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ File uploaded successfully!");
      load();
    } catch (e) {
      console.error("Error uploading file:", e);
      alert("❌ Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (path) => {
    // ✅ Fixed live download URL
    window.open(`${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/${path}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-100 pt-24">
      <DashboardHeader />
      <div className="max-w-5xl mx-auto bg-white/90 p-10 rounded-3xl shadow-xl border border-gray-200 mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🧰 My Tasks</h1>

        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col gap-3 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{t.title}</h3>
                  <p className="text-sm text-gray-600">{t.description || "—"}</p>
                  <p className="text-xs text-gray-400">
                    Priority: {t.priority} • Status: {t.status}
                  </p>
                </div>
                <select
                  value={t.status}
                  onChange={(e) => updateStatus(t._id, e.target.value)}
                  className="border p-2 rounded text-sm"
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="border-t pt-3 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📎 Upload or View Files
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-700 mb-2"
                  onChange={(e) => handleFileUpload(t._id, e.target.files[0])}
                  disabled={loading}
                />

                {t.attachments?.length > 0 ? (
                  <ul className="text-sm text-blue-600 underline">
                    {t.attachments.map((a, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded"
                      >
                        <span>{a.fileName}</span>
                        <button
                          onClick={() => handleDownload(a.filePath)}
                          className="text-green-600 hover:text-green-800 text-xs"
                        >
                          ⬇ Download
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No files uploaded yet.</p>
                )}
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="text-gray-500 text-center">No tasks assigned yet ✨</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/employee-dashboard"
            className="px-5 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Back to Employee Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
