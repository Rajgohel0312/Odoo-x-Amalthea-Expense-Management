import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ManagerEmployeeApprovals() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/manager/pending-employees");
    setPending(res.data);
  };

  const handleDecision = async (id, decision) => {
    await api.post(`/manager/employee/${id}/decide`, { decision });
    setPending(pending.filter(p => p._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Employee Approvals</h1>
      {pending.length === 0 && <div>No pending employees.</div>}
      {pending.map(emp => (
        <div key={emp._id} className="border p-4 mb-2">
          <p><b>Name:</b> {emp.name}</p>
          <p><b>Email:</b> {emp.email}</p>
          <p><b>Role:</b> {emp.role}</p>
          <button 
            onClick={() => handleDecision(emp._id, "Approved")}
            className="bg-green-500 text-white px-3 py-1 mr-2">
            Approve
          </button>
          <button 
            onClick={() => handleDecision(emp._id, "Rejected")}
            className="bg-red-500 text-white px-3 py-1">
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
