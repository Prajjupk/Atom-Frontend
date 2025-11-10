import { useEffect, useState } from "react";
import api from "../api/api"; // ✅ use unified api instance
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

export default function TaskAnalytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get("/tasks/analytics", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusData = [
    { name: "To Do", value: tasks.filter((t) => t.status === "To Do").length },
    { name: "In Progress", value: tasks.filter((t) => t.status === "In Progress").length },
    { name: "Completed", value: tasks.filter((t) => t.status === "Completed").length },
  ];

  const priorityData = [
    { name: "Low", value: tasks.filter((t) => t.priority === "Low").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "Medium").length },
    { name: "High", value: tasks.filter((t) => t.priority === "High").length },
  ];

  const employeeData = Object.values(
    tasks.reduce((acc, task) => {
      const empName = task.assignedTo?.name || "Unassigned";
      if (!acc[empName]) acc[empName] = { name: empName, completed: 0 };
      if (task.status === "Completed") acc[empName].completed++;
      return acc;
    }, {})
  );

  const COLORS = ["#3B82F6", "#FBBF24", "#10B981"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24">
      <DashboardHeader />
      <div className="max-w-6xl mx-auto bg-white/90 p-10 rounded-3xl shadow-xl border border-gray-200 mt-10">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          📊 Task Analytics Dashboard
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Real-time insights updating every <strong>10 seconds</strong> ⏱️
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-600 py-20 text-lg">
            ⚠️ No tasks found. Create some tasks to view analytics!
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Task Status */}
            <div className="bg-gray-50 shadow-md rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Task Status</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Priority */}
            <div className="bg-gray-50 shadow-md rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Task Priority</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priorityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#6366F1" barSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Employee Performance */}
            <div className="bg-gray-50 shadow-md rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Employee Performance</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={employeeData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10B981" barSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
