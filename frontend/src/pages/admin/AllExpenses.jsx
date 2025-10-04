import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AllExpenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    try {
      const res = await api.get("/admin/expenses");
      setExpenses(res.data);
    } catch (err) {
      alert("Failed to load");
    }
  };

  const overrideStatus = async (id, status) => {
    if (!confirm(`Are you sure to set ${status}?`)) return;
    try {
      await api.post(`/admin/expenses/${id}/override`, { status });
      alert("Overridden");
      load();
    } catch (err) {
      alert("Failed to override");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">All Expenses</h1>
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Claimant</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Currency</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Submitted At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e._id} className="border-t">
                <td className="p-2">{e.claimant?.name || e.claimant}</td>
                <td className="p-2">{e.amountInCompanyCurrency}</td>
                <td className="p-2">{e.companyCurrency}</td>
                <td className="p-2">{e.category}</td>
                <td className="p-2">{e.status}</td>
                <td className="p-2">
                  {e.submittedAt
                    ? new Date(e.submittedAt).toLocaleString()
                    : "-"}
                </td>
                <td className="p-2">
                  <button
                    className="bg-green-600 text-white px-2 py-1 mr-2 rounded"
                    onClick={() => overrideStatus(e._id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => overrideStatus(e._id, "Rejected")}
                  >
                    Reject
                  </button>
                </td>
                <tr>
                  <td colSpan="7" className="bg-gray-50">
                    {e.approvals && e.approvals.length > 0 && (
                      <div className="p-2">
                        <ApprovalTimeline approvals={e.approvals} />
                      </div>
                    )}
                  </td>
                </tr>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="7" className="p-2">
                  No expenses
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
