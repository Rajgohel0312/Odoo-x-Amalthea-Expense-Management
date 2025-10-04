import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Employee", managerId: "" });
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      // managers list for manager assignment
      const mgrs = res.data.filter(u => u.role === "Manager" || u.role === "Admin");
      setManagers(mgrs);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      alert("User created (password emailed automatically)");
      setForm({ name: "", email: "", password: "", role: "Employee", managerId: "" });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Create user failed");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      fetchUsers();
    } catch (err) {
      alert("Update failed");
    }
  };

  // ✅ New function: Resend password
  const handleResendPassword = async (id) => {
    if (!window.confirm("Resend a new random password to this user?")) return;
    try {
      await api.post(`/users/${id}/resend-password`);
      alert("New password sent to user’s email!");
    } catch (err) {
      alert(err.response?.data?.message || "Resend password failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create User Form */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Create User</h2>
          <form onSubmit={handleCreate} className="space-y-2">
            <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="border p-2 w-full" />
            <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="border p-2 w-full" />
            <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password (optional)" className="border p-2 w-full" />
            <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="border p-2 w-full">
              <option>Employee</option>
              <option>Manager</option>
              <option>Finance</option>
              <option>Director</option>
              <option>CFO</option>
              <option>Admin</option>
            </select>
            <select value={form.managerId} onChange={e=>setForm({...form,managerId:e.target.value})} className="border p-2 w-full">
              <option value="">-- Assign Manager (optional) --</option>
              {managers.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
            </select>
            <button className="bg-blue-600 text-white py-2 px-3 rounded">Create</button>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Manager</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">{u.manager ? u.manager : "-"}</td>
                    <td className="p-2 flex gap-2">
                      {/* Role dropdown */}
                      <select
                        value={u.role}
                        onChange={e=>handleRoleChange(u._id, e.target.value)}
                        className="border p-1"
                      >
                        <option>Employee</option>
                        <option>Manager</option>
                        <option>Finance</option>
                        <option>Director</option>
                        <option>CFO</option>
                        <option>Admin</option>
                      </select>
                      {/* ✅ Send Password Button */}
                      <button
                        onClick={() => handleResendPassword(u._id)}
                        className="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300"
                      >
                        Send Password
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-2 text-center">No users</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
