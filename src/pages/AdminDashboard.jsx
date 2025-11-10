import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../api/api";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  // ✅ Fetch tasks and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, userRes] = await Promise.all([
          api.get("/tasks", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          api.get("/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        setTasks(taskRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Task Report (PDF + Excel)
  const downloadTaskReport = async (format) => {
    if (tasks.length === 0) {
      alert("No tasks available to export.");
      return;
    }

    if (format === "pdf") {
      try {
        const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
        doc.setFontSize(18);
        doc.text("Task Report - Admin Overview", 40, 40);

        const tableColumn = ["Title", "Status", "Priority", "Assigned To"];
        const tableRows = tasks.map((t) => [
          t.title || "-",
          t.status || "-",
          t.priority || "-",
          t.assignedTo?.name || "Unassigned",
        ]);

        autoTable(doc, {
          startY: 70,
          head: [tableColumn],
          body: tableRows,
          styles: { fontSize: 10, cellPadding: 6 },
          headStyles: { fillColor: [63, 81, 181] },
        });

        const timestamp = new Date().toLocaleString().replace(/[/,: ]/g, "_");
        doc.save(`Admin_Task_Report_${timestamp}.pdf`);
      } catch (err) {
        console.error("PDF generation failed:", err);
        alert("Failed to generate PDF. Check console for details.");
      }
    } else if (format === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(
        tasks.map((t) => ({
          Title: t.title,
          Status: t.status,
          Priority: t.priority,
          "Assigned To": t.assignedTo?.name || "Unassigned",
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Admin_Task_Report.xlsx");
    }
  };

  // ✅ User Report (PDF + Excel)
  const downloadUserReport = async (format) => {
    if (users.length === 0) {
      alert("No users available to export.");
      return;
    }

    if (format === "pdf") {
      try {
        const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
        doc.setFontSize(18);
        doc.text("User Report - Admin Overview", 40, 40);

        const tableColumn = ["Name", "Email", "Role"];
        const tableRows = users.map((u) => [u.name || "-", u.email || "-", u.role || "-"]);

        autoTable(doc, {
          startY: 70,
          head: [tableColumn],
          body: tableRows,
          styles: { fontSize: 10, cellPadding: 6 },
          headStyles: { fillColor: [88, 80, 141] },
        });

        const timestamp = new Date().toLocaleString().replace(/[/,: ]/g, "_");
        doc.save(`User_Report_${timestamp}.pdf`);
      } catch (err) {
        console.error("User PDF generation failed:", err);
        alert("Failed to generate User PDF. Check console for details.");
      }
    } else if (format === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(
        users.map((u) => ({
          Name: u.name,
          Email: u.email,
          Role: u.role,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "User_Report.xlsx");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 pt-24">
      <DashboardHeader />
      <div className="flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center w-full max-w-2xl border border-gray-200">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            👑 Welcome, <span className="text-purple-700">Admin</span>
          </h1>
          <p className="text-gray-600 mb-10 text-lg">Admin Dashboard</p>

          <div className="flex flex-col gap-5">
            <button
              onClick={() => navigate("/admin-users")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-md transition w-full"
            >
              Manage Users
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition w-full"
            >
              View Task Analytics
            </button>
            <button
              onClick={() => navigate("/admin-overview")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition w-full"
            >
              Task Overview
            </button>
          </div>

          {/* ✅ Reports Section */}
          <div className="mt-10 space-y-3">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              📊 Download Reports
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {/* Task Reports */}
              <button
                onClick={() => downloadTaskReport("pdf")}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                📄 Task PDF
              </button>
              <button
                onClick={() => downloadTaskReport("excel")}
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                📊 Task Excel
              </button>

              {/* User Reports */}
              <button
                onClick={() => downloadUserReport("pdf")}
                className="px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
              >
                👥 User PDF
              </button>
              <button
                onClick={() => downloadUserReport("excel")}
                className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                👤 User Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
