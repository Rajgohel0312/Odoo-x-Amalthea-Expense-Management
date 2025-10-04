import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PendingApprovals() {
  const { user } = useAuth(); // get user role/name
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
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
    await api.post(`/approvals/${id}/decide`, { decision });
    setApprovals((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
          Pending Approvals ({user?.role})
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <p>Loading approvals...</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              All clear!
            </h2>
            <p className="text-gray-500 text-sm">
              You have no pending approvals right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {approvals.map((a) => {
              const expense = a.expense || {};
              const claimant = expense.claimant || {};
              return (
                <div
                  key={a._id}
                  className="bg-white p-5 rounded-lg shadow hover:shadow-md border border-gray-200 transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-lg text-gray-800">
                      {claimant.name || "Unknown Employee"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {expense.description || "No description"}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                      ₹{expense.amountInCompanyCurrency || 0}{" "}
                      <span className="text-gray-500">
                        • {expense.category || "Uncategorized"}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                      onClick={() => handleDecision(a._id, "Approved")}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(a._id, "Rejected")}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                      Reject
                    </button>
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
