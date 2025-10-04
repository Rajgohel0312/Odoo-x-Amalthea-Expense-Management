import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  PlusCircle,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const res = await api.get("/employee/my-expenses");
      setExpenses(res.data);

      const approved = res.data.filter((e) => e.status === "Approved").length;
      const pending = res.data.filter((e) => e.status === "Pending").length;
      const rejected = res.data.filter((e) => e.status === "Rejected").length;
      setStats({ approved, pending, rejected });
    } catch (err) {
      console.error("Failed to load expenses", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 font-[Helvetica]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#52a4b0]">
              Welcome, {user?.name || "Employee"} 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Track your expenses and manage your submissions.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/employee/new-expense"
              className="flex items-center gap-2 bg-[#52a4b0] hover:bg-[#3c8894] text-white px-4 py-2 rounded-lg shadow transition"
            >
              <PlusCircle size={18} /> Add Expense
            </Link>
            <Link
              to="/employee/my-expenses"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow transition"
            >
              <FileText size={18} /> My Expenses
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow p-6 text-center border border-gray-100">
            <h3 className="text-gray-500 font-medium">Approved</h3>
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mt-2" />
            <p className="text-3xl font-bold text-green-600 mt-1">
              {stats.approved}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center border border-gray-100">
            <h3 className="text-gray-500 font-medium">Pending</h3>
            <Clock className="w-6 h-6 text-yellow-500 mx-auto mt-2" />
            <p className="text-3xl font-bold text-yellow-500 mt-1">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center border border-gray-100">
            <h3 className="text-gray-500 font-medium">Rejected</h3>
            <XCircle className="w-6 h-6 text-red-500 mx-auto mt-2" />
            <p className="text-3xl font-bold text-red-500 mt-1">
              {stats.rejected}
            </p>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <FileText className="text-[#52a4b0]" /> Recent Expenses
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-500">
              <Loader2 className="animate-spin mr-2" /> Loading your expenses...
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-16 text-gray-500 italic">
              No expenses submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-t">
                <thead>
                  <tr className="text-left border-b bg-gray-100 text-gray-600">
                    <th className="p-3">Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 5).map((exp) => (
                    <tr
                      key={exp._id}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="p-3">{exp.description}</td>
                      <td className="p-3 font-semibold text-[#52a4b0]">
                        {exp.amountInCompanyCurrency} {exp.companyCurrency}
                      </td>
                      <td className="p-3 text-gray-600">{exp.category}</td>
                      <td className="p-3 text-gray-500">
                        {new Date(exp.dateSpent).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            exp.status
                          )}`}
                        >
                          {exp.status}
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
    </div>
  );
}
