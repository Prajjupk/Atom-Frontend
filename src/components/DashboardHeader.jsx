import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role") || "Employee";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const roleColors = {
    Admin: "bg-purple-100 text-purple-700",
    Manager: "bg-blue-100 text-blue-700",
    Employee: "bg-green-100 text-green-700",
  };

  return (
    <header className="w-full flex items-center justify-between px-10 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
        Atom<span className="text-blue-600 font-bold">M</span> Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${roleColors[role]}`}
        >
          {role}
        </span>
        <span className="text-gray-700 font-medium">{name}</span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg font-semibold shadow-md transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
