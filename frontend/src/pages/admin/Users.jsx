import { useEffect, useState } from "react";
import api from "../../api/axios";
import { UserPlus, RefreshCw, Mail } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    managerId: "",
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      const mgrs = res.data.filter(
        (u) => u.role === "Manager" || u.role === "Admin"
      );
      setManagers(mgrs);
    } catch (err) {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      alert("✅ User created (password emailed automatically)");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "Employee",
        managerId: "",
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Create user failed");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      fetchUsers();
    } catch {
      alert("Role update failed");
    }
  };

  const handleResendPassword = async (id) => {
    if (!window.confirm("Resend a new random password to this user?")) return;
    try {
      await api.post(`/users/${id}/resend-password`);
      alert("📧 New password sent to user’s email!");
    } catch (err) {
      alert(err.response?.data?.message || "Resend password failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-[Helvetica]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#52a4b0]">
          👤 User Management
        </h1>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 bg-[#52a4b0] text-white px-4 py-2 rounded-lg shadow hover:bg-[#3b8892]"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create User */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserPlus size={20} /> Create New User
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter name"
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-[#52a4b0] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter email"
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-[#52a4b0] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password (optional)
              </label>
              <input
                type="text"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Leave blank for auto-generate"
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-[#52a4b0] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-[#52a4b0] outline-none"
              >
                <option>Employee</option>
                <option>Manager</option>
                <option>Finance</option>
                <option>Director</option>
                <option>CFO</option>
                <option>Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Assign Manager
              </label>
              <select
                value={form.managerId}
                onChange={(e) =>
                  setForm({ ...form, managerId: e.target.value })
                }
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-[#52a4b0] outline-none"
              >
                <option value="">-- None --</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              className="bg-[#52a4b0] text-white w-full py-2 rounded-lg shadow hover:bg-[#3b8892] transition-all"
              type="submit"
            >
              Create User
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-[#52a4b0] text-white">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-left">Manager</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b hover:bg-gray-50 transition-all"
                      >
                        <td className="p-2">{u.name}</td>
                        <td className="p-2 text-gray-600">{u.email}</td>
                        <td className="p-2">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                            className="border rounded p-1 text-sm"
                          >
                            <option>Employee</option>
                            <option>Manager</option>
                            <option>Finance</option>
                            <option>Director</option>
                            <option>CFO</option>
                            <option>Admin</option>
                          </select>
                        </td>
                        <td className="p-2 text-gray-500">
                          {u.manager || "-"}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleResendPassword(u._id)}
                            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded flex items-center gap-1 mx-auto"
                          >
                            <Mail size={14} /> Send Password
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center p-4 text-gray-500 italic"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
