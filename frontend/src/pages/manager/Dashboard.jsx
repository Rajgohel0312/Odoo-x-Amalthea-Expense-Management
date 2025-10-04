import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ approved: 0, rejected: 0, pending: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        api.get("/manager/approval-stats"),
        api.get("/manager/recent-approved"),
      ]);
      setStats(statsRes.data);
      setRecent(recentRes.data);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name || "Manager"}
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Navigation Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/manager"
          className="bg-white border rounded shadow hover:shadow-md p-4 text-center"
        >
          🏠 Dashboard
        </Link>
        <Link
          to="/manager/team"
          className="bg-white border rounded shadow hover:shadow-md p-4 text-center"
        >
          👥 Team Expenses
        </Link>
        <Link
          to="/manager/approvals"
          className="bg-white border rounded shadow hover:shadow-md p-4 text-center"
        >
          ✅ Pending Approvals
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Rejected</h3>
          <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
        </div>
      </div>

      {/* Recent Approved Section */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Recently Approved Expenses</h2>
        {recent.length === 0 ? (
          <div className="text-gray-500">No recent approvals</div>
        ) : (
          <table className="w-full text-sm border-t">
            <thead>
              <tr className="text-left border-b bg-gray-100">
                <th className="p-2">Employee</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Category</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((exp) => (
                <tr key={exp._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{exp.claimant?.name || "Unknown"}</td>
                  <td className="p-2">{exp.amountInCompanyCurrency}</td>
                  <td className="p-2">{exp.category}</td>
                  <td className="p-2">
                   {new Date(exp.dateSpent || exp.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
