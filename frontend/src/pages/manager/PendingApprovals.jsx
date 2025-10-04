import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function PendingApprovals() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      const res = await api.get("/approvals/pending");
      setApprovals(res.data);
    } catch (err) {
      console.error("Failed to load approvals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, decision) => {
    const confirmMsg =
      decision === "Approved"
        ? "Approve this expense?"
        : "Reject this expense?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.post(`/approvals/${id}/decide`, { decision });
      setApprovals((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to update decision");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 font-[Helvetica]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-[#52a4b0]">
            Pending Approvals
          </h1>
          <p className="text-gray-500 mt-1">
            Review and take action on expenses awaiting your approval.
          </p>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-60 text-gray-600">
            <Loader2 className="w-7 h-7 animate-spin text-[#52a4b0] mb-2" />
            <p>Loading approvals...</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow p-16 border border-gray-100">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-gray-700">
              All approvals cleared!
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              No pending expense requests right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((a) => {
              const expense = a.expense || {};
              const claimant = expense.claimant || {};
              return (
                <div
                  key={a._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Left section */}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {claimant.name || "Unknown Employee"}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {expense.description || "No description provided"}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-700">
                        <span className="text-[#52a4b0] font-semibold">
                          ₹{expense.amountInCompanyCurrency}
                        </span>{" "}
                        {expense.companyCurrency} •{" "}
                        {expense.category || "General"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(expense.dateSpent).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Right section */}
                    <div className="flex gap-3 mt-4 md:mt-0">
                      <button
                        onClick={() => handleDecision(a._id, "Approved")}
                        className="flex items-center gap-1 bg-[#52a4b0] hover:bg-[#42909b] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(a._id, "Rejected")}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
