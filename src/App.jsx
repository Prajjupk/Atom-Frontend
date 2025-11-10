import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminUsers from "./pages/AdminUsers";
import ManagerTasks from "./pages/ManagerTasks";
import EmployeeTasks from "./pages/EmployeeTasks";
import TaskAnalytics from "./pages/TaskAnalytics";
import AdminTaskOverview from "./pages/AdminTaskOverview";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const Protected = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  };

  return (
    <Router>
      <Routes>
        {/* ===== Public Routes ===== */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/signup" element={<Signup />} />

        {/* ===== Admin Routes ===== */}
        <Route
          path="/admin-dashboard"
          element={
            <Protected>
              <AdminDashboard />
            </Protected>
          }
        />
        <Route
          path="/admin-users"
          element={
            <Protected>
              <AdminUsers />
            </Protected>
          }
        />
        <Route
          path="/admin-overview"
          element={
            <Protected>
              <AdminTaskOverview />
            </Protected>
          }
        />

        {/* ===== Manager Routes ===== */}
        <Route
          path="/manager-dashboard"
          element={
            <Protected>
              <ManagerDashboard />
            </Protected>
          }
        />
        <Route
          path="/manager-tasks"
          element={
            <Protected>
              <ManagerTasks />
            </Protected>
          }
        />

        {/* ===== Employee Routes ===== */}
        <Route
          path="/employee-dashboard"
          element={
            <Protected>
              <EmployeeDashboard />
            </Protected>
          }
        />
        <Route
          path="/employee-tasks"
          element={
            <Protected>
              <EmployeeTasks />
            </Protected>
          }
        />

        {/* ===== Analytics ===== */}
        <Route
          path="/analytics"
          element={
            <Protected>
              <TaskAnalytics />
            </Protected>
          }
        />

        {/* ===== Fallback ===== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
