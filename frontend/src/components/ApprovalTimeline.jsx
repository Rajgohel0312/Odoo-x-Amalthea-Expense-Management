// src/components/ApprovalTimeline.jsx
export default function ApprovalTimeline({ approvals }) {
  if (!approvals || approvals.length === 0) return null;

  const getColor = (decision) => {
    if (decision === "Approved") return "text-green-600";
    if (decision === "Rejected") return "text-red-600";
    if (decision === "Pending") return "text-yellow-600";
    if (decision === "Skipped") return "text-gray-500";
    return "text-gray-700";
  };

  return (
    <div className="mt-3 text-sm bg-gray-50 p-2 rounded">
      <div className="font-medium mb-1 text-gray-700">Approval Progress</div>
      <div className="flex flex-wrap items-center gap-2">
        {approvals.map((a, idx) => (
          <div key={a._id || idx} className="flex items-center gap-1">
            <span className={`font-semibold ${getColor(a.decision)}`}>
              {a.approver?.name || "Unknown"} ({a.decision})
            </span>
            {idx !== approvals.length - 1 && <span className="text-gray-400">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
