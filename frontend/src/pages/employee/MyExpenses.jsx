import { useEffect, useState } from "react";
import api from "../../api/axios";
import ApprovalTimeline from "../../components/ApprovalTimeline.JSX";
export default function MyExpenses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses/me");
      setItems(res.data);
    } catch (err) {
      alert("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">My Expenses</h1>
      <div className="space-y-3">
        {loading && <div>Loading...</div>}
        {items.map((it) => (
          <div key={it._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">
                  {it.description || "No description"}
                </div>
                <div className="text-sm text-gray-600">
                  {it.category} • {new Date(it.dateSpent).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {it.amountInCompanyCurrency} {it.companyCurrency}
                </div>
                <div
                  className={`text-sm ${
                    it.status === "Approved"
                      ? "text-green-600"
                      : it.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {it.status}
                </div>
              </div>
            </div>

            <ApprovalTimeline approvals={it.approvals} />
          </div>
        ))}
        {items.length === 0 && !loading && <div>No expenses yet</div>}
      </div>
    </div>
  );
}
