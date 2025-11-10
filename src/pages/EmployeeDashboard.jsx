import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 pt-24">
      <DashboardHeader />
      <div className="flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl text-center w-full max-w-2xl border border-gray-200">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            👷 Welcome, <span className="text-green-700">{name}</span>
          </h1>
          <p className="text-gray-600 mb-10 text-lg">Employee Dashboard</p>

          <button
            onClick={() => navigate("/employee-tasks")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition w-full"
          >
            View My Tasks
          </button>
        </div>
      </div>
    </div>
  );
}
