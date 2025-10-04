import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function TeamExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/manager/team-expenses");
      setExpenses(res.data);
    } catch (err) {
      alert("Failed to load team expenses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team Expenses</h1>
      {loading && <div>Loading...</div>}
      {!loading && expenses.length === 0 && <div>No team expenses yet.</div>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Employee</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Currency</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{exp.claimant?.name || "Unknown"}</td>
                <td className="p-2">{exp.amountInCompanyCurrency}</td>
                <td className="p-2">{exp.companyCurrency}</td>
                <td className="p-2">{exp.category}</td>
                <td className={`p-2 font-medium ${
                  exp.status === "Approved"
                    ? "text-green-600"
                    : exp.status === "Rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}>
                  {exp.status}
                </td>
                <td className="p-2">{new Date(exp.dateSpent).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
