import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

export default function ManagerTasks() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const load = async () => {
    try {
      const [empRes, taskRes] = await Promise.all([
        api.get("/users/employees", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setEmployees(empRes.data);
      setTasks(taskRes.data);
    } catch (e) {
      console.error("Error loading data:", e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/tasks", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        title: "",
        description: "",
        assignedTo: "",
        deadline: "",
        priority: "Medium",
      });
      await load();
    } catch (e) {
      console.error("Error creating task:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch (e) {
      console.error("Error deleting task:", e);
    }
  };

  const handleDownload = (path) => {
    // ✅ Fixed for deployed backend
    window.open(`${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/${path}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 pt-24">
      <DashboardHeader />
      <div className="max-w-6xl mx-auto bg-white/90 p-10 rounded-3xl shadow-xl border border-gray-200 mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📋 Manage Tasks</h1>

        {/* Create Form */}
        <form
          onSubmit={handleCreate}
          className="bg-gray-50 p-5 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3"
        >
          <input
            className="border rounded p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="border rounded p-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="border rounded p-2"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          >
            <option value="">Assign to… (Employee)</option>
            {employees.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="border rounded p-2"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <select
            className="border rounded p-2"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className={`md:col-span-5 bg-blue-600 text-white rounded p-2 hover:bg-blue-700 ${
              loading ? "opacity-60" : ""
            }`}
          >
            {loading ? "Creating…" : "Create Task"}
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{t.title}</h3>
                  <p className="text-sm text-gray-600">{t.description || "—"}</p>
                  <p className="text-xs text-gray-400">
                    Assigned:{" "}
                    {t.assignedTo
                      ? `${t.assignedTo.name} (${t.assignedTo.email})`
                      : "Unassigned"}{" "}
                    • Priority: {t.priority} • Status: {t.status}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              {t.attachments?.length > 0 && (
                <div className="border-t pt-3 mt-2">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    📎 Uploaded Files
                  </p>
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
                </div>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="text-gray-500 text-center">No tasks yet. Create one above ✨</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/manager-dashboard"
            className="px-5 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
