import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardHeader from "../components/DashboardHeader";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    await api.patch(
      `/users/${id}/role`,
      { role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading users...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24">
      {/* ✅ Added consistent header */}
      <DashboardHeader />
      <div className="max-w-6xl mx-auto bg-white/90 p-10 rounded-3xl shadow-xl border border-gray-200 mt-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          👑 Manage Users
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border p-1 rounded text-sm bg-white"
                    >
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Employee</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              No users found 👻
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
