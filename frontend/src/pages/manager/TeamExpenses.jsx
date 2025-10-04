import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Loader2, Users } from "lucide-react";

export default function TeamExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/manager/team-expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to load team expenses", err);
      alert("Failed to load team expenses");
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#52a4b0]">
              👥 Team Expenses
            </h1>
            <p className="text-gray-500 mt-1">
              View all expenses submitted by your team members.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-60 text-gray-600">
            <Loader2 className="w-7 h-7 animate-spin text-[#52a4b0] mb-2" />
            <p>Loading team expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow p-16 border border-gray-100">
            <Users className="w-12 h-12 text-[#52a4b0] mx-auto mb-4 opacity-80" />
            <h2 className="text-lg font-semibold text-gray-700">
              No team expenses yet
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Once your team members submit their expenses, they’ll appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left border-b">
                  <th className="p-3 font-medium">Employee</th>
                  <th className="p-3 font-medium">Amount</th>
                  <th className="p-3 font-medium">Currency</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr
                    key={exp._id}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="p-3">{exp.claimant?.name || "Unknown"}</td>
                    <td className="p-3 font-semibold text-[#52a4b0]">
                      {exp.amountInCompanyCurrency} {exp.companyCurrency}
                    </td>
                    <td className="p-3 text-gray-700">{exp.companyCurrency}</td>
                    <td className="p-3 text-gray-600">{exp.category}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          exp.status
                        )}`}
                      >
                        {exp.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(exp.dateSpent).toLocaleDateString()}
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
