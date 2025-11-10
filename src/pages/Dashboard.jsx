import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "Employee";
  const name = localStorage.getItem("name") || "User";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-[420px]">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {name} 👋</h1>
        <p className="text-gray-600 mb-6">
          Role: <span className="font-semibold text-blue-600">{role}</span>
        </p>

        {role === "Admin" && (
          <button
            onClick={() => navigate("/tasks")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition mb-3 w-full"
          >
            Admin: Manage All Tasks
          </button>
        )}

        {(role === "Manager" || role === "Admin") && (
          <button
            onClick={() => navigate("/tasks")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-3 w-full"
          >
            Manager: Assign / Update Tasks
          </button>
        )}

        {role === "Employee" && (
          <button
            onClick={() => navigate("/tasks")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mb-3 w-full"
          >
            View My Tasks
          </button>
        )}

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
