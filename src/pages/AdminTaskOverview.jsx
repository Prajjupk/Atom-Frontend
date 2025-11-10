import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

export default function AdminTaskOverview() {
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    toDo: 0,
    uploads: 0,
    managerStats: [],
  });

  const loadOverview = async () => {
    try {
      const { data } = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const total = data.length;
      const completed = data.filter((t) => t.status === "Completed").length;
      const inProgress = data.filter((t) => t.status === "In Progress").length;
      const toDo = data.filter((t) => t.status === "To Do").length;
      const uploads = data.reduce(
        (sum, t) => sum + (t.attachments?.length || 0),
        0
      );

      // Count tasks per manager
      const managerMap = {};
      data.forEach((t) => {
        const manager = t.createdBy?.name || "Unassigned";
        managerMap[manager] = (managerMap[manager] || 0) + 1;
      });

      const managerStats = Object.entries(managerMap).map(([manager, count]) => ({
        manager,
        count,
      }));

      setSummary({ total, completed, inProgress, toDo, uploads, managerStats });
    } catch (err) {
      console.error("Error loading overview:", err);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* ✅ Added top header for consistency */}
      <DashboardHeader />

      <div className="max-w-6xl mx-auto mt-24 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-10 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          📊 Admin Task Overview
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-green-50 p-6 rounded-xl text-center shadow hover:shadow-md transition">
            <p className="text-lg font-semibold text-green-700">✅ Completed</p>
            <p className="text-3xl font-bold mt-2">{summary.completed}</p>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl text-center shadow hover:shadow-md transition">
            <p className="text-lg font-semibold text-yellow-700">🔄 In Progress</p>
            <p className="text-3xl font-bold mt-2">{summary.inProgress}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl text-center shadow hover:shadow-md transition">
            <p className="text-lg font-semibold text-blue-700">🕓 To Do</p>
            <p className="text-3xl font-bold mt-2">{summary.toDo}</p>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl text-center shadow hover:shadow-md transition">
            <p className="text-lg font-semibold text-purple-700">📎 Uploads</p>
            <p className="text-3xl font-bold mt-2">{summary.uploads}</p>
          </div>
        </div>

        {/* Manager Stats */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            👨‍💼 Tasks Assigned by Manager
          </h2>
          <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-gray-700 font-semibold">Manager</th>
                  <th className="p-3 text-right text-gray-700 font-semibold">Tasks</th>
                </tr>
              </thead>
              <tbody>
                {summary.managerStats.map((m, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-gray-700">{m.manager}</td>
                    <td className="p-3 text-right text-gray-700 font-medium">
                      {m.count}
                    </td>
                  </tr>
                ))}
                {summary.managerStats.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="text-center p-4 text-gray-500 italic"
                    >
                      No task data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/admin-dashboard"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 hover:shadow-lg transition-all duration-300"
          >
            ⬅ Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
