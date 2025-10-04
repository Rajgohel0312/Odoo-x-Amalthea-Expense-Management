import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart2,
  Users,
  ClipboardCheck,
  LogOut,
  Loader2,
} from "lucide-react";

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ approved: 0, rejected: 0, pending: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  const navItems = [
    { path: "/manager", label: "Dashboard Overview", icon: BarChart2 },
    { path: "/manager/team", label: "Team Expenses", icon: Users },
    { path: "/manager/approvals", label: "Pending Approvals", icon: ClipboardCheck },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-[#52a4b0]">
        <Loader2 className="animate-spin mr-2" /> Loading Manager Dashboard...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-[Helvetica] transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#52a4b0]">
            Welcome, {user?.name || "Manager"} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here’s your activity summary and recent approvals.
          </p>
        </div>
       
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center border p-5 rounded-2xl shadow transition-all ${
                isActive
                  ? "bg-[#52a4b0] text-white border-[#52a4b0] shadow-lg"
                  : "bg-white text-gray-700 border-gray-100 hover:border-[#52a4b0] hover:shadow-lg"
              }`}
            >
              <Icon
                size={32}
                className={`mb-2 ${
                  isActive ? "text-white" : "text-[#52a4b0]"
                }`}
              />
              <h3 className="font-semibold">{label}</h3>
              <p
                className={`text-sm ${
                  isActive ? "text-white/80" : "text-gray-500"
                }`}
              >
                {label === "Team Expenses"
                  ? "View your team’s claims"
                  : label === "Pending Approvals"
                  ? "Review and decide"
                  : "Track your insights"}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow p-6 text-center border border-gray-100 hover:shadow-lg transition-all">
          <h3 className="text-gray-500 font-medium">Approved</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {stats.approved}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center border border-gray-100 hover:shadow-lg transition-all">
          <h3 className="text-gray-500 font-medium">Pending</h3>
          <p className="text-4xl font-bold text-yellow-500 mt-2">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center border border-gray-100 hover:shadow-lg transition-all">
          <h3 className="text-gray-500 font-medium">Rejected</h3>
          <p className="text-4xl font-bold text-red-500 mt-2">
            {stats.rejected}
          </p>
        </div>
      </div>

      {/* Recent Approved Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          ✅ Recently Approved Expenses
        </h2>
        {recent.length === 0 ? (
          <div className="text-gray-500 text-sm italic text-center py-8">
            No recent approvals found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-t">
              <thead>
                <tr className="text-left border-b bg-gray-100">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((exp) => (
                  <tr
                    key={exp._id}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="p-3">{exp.claimant?.name || "Unknown"}</td>
                    <td className="p-3 font-semibold text-[#52a4b0]">
                      {exp.amountInCompanyCurrency} {exp.companyCurrency}
                    </td>
                    <td className="p-3 text-gray-600">{exp.category}</td>
                    <td className="p-3 text-gray-500">
                      {new Date(
                        exp.dateSpent || exp.submittedAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
