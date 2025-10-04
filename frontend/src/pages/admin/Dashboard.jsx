import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, expenses: { total: 0, approved: 0, rejected: 0, pending: 0 } });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const usersRes = await api.get("/users");
      const expensesRes = await api.get("/admin/expenses");
      const approved = expensesRes.data.filter(e => e.status === "Approved").length;
      const rejected = expensesRes.data.filter(e => e.status === "Rejected").length;
      const pending = expensesRes.data.filter(e => e.status === "Waiting").length;

      setStats({
        users: usersRes.data.length,
        expenses: {
          total: expensesRes.data.length,
          approved,
          rejected,
          pending
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">{stats.users}</h2>
          <p className="text-gray-600">Users</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">{stats.expenses.total}</h2>
          <p className="text-gray-600">Total Expenses</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-green-600">{stats.expenses.approved}</h2>
          <p className="text-gray-600">Approved</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-red-600">{stats.expenses.rejected}</h2>
          <p className="text-gray-600">Rejected</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center md:col-span-2">
          <h2 className="text-xl font-semibold text-yellow-600">{stats.expenses.pending}</h2>
          <p className="text-gray-600">Pending</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/admin/users")}
          className="bg-blue-50 hover:bg-blue-100 p-6 rounded shadow cursor-pointer text-center"
        >
          <h3 className="text-lg font-bold text-blue-600">User Management</h3>
          <p className="text-sm text-gray-600 mt-2">Create, update, and assign roles</p>
        </div>

        <div
          onClick={() => navigate("/admin/rules")}
          className="bg-green-50 hover:bg-green-100 p-6 rounded shadow cursor-pointer text-center"
        >
          <h3 className="text-lg font-bold text-green-600">Approval Rules</h3>
          <p className="text-sm text-gray-600 mt-2">Define workflow & conditional approvals</p>
        </div>

        <div
          onClick={() => navigate("/admin/expenses")}
          className="bg-purple-50 hover:bg-purple-100 p-6 rounded shadow cursor-pointer text-center"
        >
          <h3 className="text-lg font-bold text-purple-600">All Expenses</h3>
          <p className="text-sm text-gray-600 mt-2">View & override expense claims</p>
        </div>
      </div>
    </div>
  );
}
