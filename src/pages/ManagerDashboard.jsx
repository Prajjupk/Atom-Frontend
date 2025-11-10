import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../api/api";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/tasks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  const downloadReport = async (format) => {
    if (tasks.length === 0) {
      alert("No tasks available to export.");
      return;
    }

    if (format === "pdf") {
      try {
        const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
        doc.setFontSize(18);
        doc.text("Task Report - Manager Overview", 40, 40);

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
          headStyles: { fillColor: [30, 64, 175] },
        });

        const timestamp = new Date().toLocaleString().replace(/[/,: ]/g, "_");
        doc.save(`Manager_Task_Report_${timestamp}.pdf`);
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
      saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Manager_Task_Report.xlsx");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 pt-24">
      <DashboardHeader />
      <div className="flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center w-full max-w-2xl border border-gray-200">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            📋 Welcome, <span className="text-indigo-700">{name}</span>
          </h1>
          <p className="text-gray-600 mb-10 text-lg">Manager Dashboard</p>

          <div className="flex flex-col gap-5">
            <button
              onClick={() => navigate("/manager-tasks")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition w-full"
            >
              Manage Tasks
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition w-full"
            >
              View Task Analytics
            </button>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => downloadReport("pdf")}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              📄 Download PDF
            </button>
            <button
              onClick={() => downloadReport("excel")}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              📊 Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
