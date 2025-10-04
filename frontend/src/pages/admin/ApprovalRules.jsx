import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ApprovalRules() {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({
    name: "",
    approvers: [{ type: "ManagerSlot", order: 1 }],
    conditional: { type: "none", percentageRequired: 0, specificApprover: "" }
  });
  const [companyUsers, setCompanyUsers] = useState([]);

  useEffect(() => { fetchRules(); fetchUsers(); }, []);

  const fetchRules = async () => {
    try {
      const res = await api.get("/admin/approval-rules");
      setRules(res.data);
    } catch (err) {
      alert("Failed to load rules");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setCompanyUsers(res.data);
    } catch (err) { }
  };

  const addApproverSlot = () =>
    setForm({
      ...form,
      approvers: [
        ...form.approvers,
        { type: "Role", role: "Finance", order: form.approvers.length + 1 }
      ]
    });

  const handleApproverChange = (idx, key, value) => {
    const arr = [...form.approvers];
    arr[idx][key] = value;
    setForm({ ...form, approvers: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // sanitize
      const payload = JSON.parse(JSON.stringify(form));
      if (payload.conditional?.specificApprover === "") {
        delete payload.conditional.specificApprover;
      }
      if (payload.conditional?.type === "none") {
        delete payload.conditional;
      }

      await api.post("/admin/approval-rules", payload);
      alert("Rule created");
      setForm({
        name: "",
        approvers: [{ type: "ManagerSlot", order: 1 }],
        conditional: { type: "none", percentageRequired: 0, specificApprover: "" }
      });
      fetchRules();
    } catch (err) {
      console.error("Create rule failed", err);
      alert("Create rule failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Approval Rules</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* CREATE FORM */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Create Rule</h3>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              required
              className="border p-2 w-full"
              placeholder="Rule name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            {/* Approver Steps */}
            <div>
              <h4 className="font-medium">Approver Steps</h4>
              {form.approvers.map((slot, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <select
                    value={slot.type}
                    onChange={(e) => handleApproverChange(idx, "type", e.target.value)}
                    className="border p-2"
                  >
                    <option value="ManagerSlot">Manager (claimant's manager)</option>
                    <option value="Role">Role</option>
                    <option value="User">Specific User</option>
                  </select>

                  {slot.type === "Role" && (
                    <input
                      placeholder="Role (Finance)"
                      className="border p-2"
                      value={slot.role || ""}
                      onChange={(e) => handleApproverChange(idx, "role", e.target.value)}
                    />
                  )}
                  {slot.type === "User" && (
                    <select
                      value={slot.user || ""}
                      onChange={(e) => handleApproverChange(idx, "user", e.target.value)}
                      className="border p-2"
                    >
                      <option value="">-- select user --</option>
                      {companyUsers.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="number"
                    className="w-20 border p-2"
                    value={slot.order}
                    onChange={(e) =>
                      handleApproverChange(idx, "order", Number(e.target.value))
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addApproverSlot}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                + add step
              </button>
            </div>

            {/* Conditional */}
            <div className="mt-3">
              <h4 className="font-medium">Conditional</h4>
              <select
                value={form.conditional.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    conditional: { ...form.conditional, type: e.target.value }
                  })
                }
                className="border p-2 w-full mb-2"
              >
                <option value="none">None</option>
                <option value="percentage">Percentage</option>
                <option value="specific">Specific Approver</option>
                <option value="hybrid">Hybrid</option>
              </select>

              {(form.conditional.type === "percentage" ||
                form.conditional.type === "hybrid") && (
                <input
                  type="number"
                  value={form.conditional.percentageRequired || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      conditional: {
                        ...form.conditional,
                        percentageRequired: Number(e.target.value)
                      }
                    })
                  }
                  placeholder="Percentage required (e.g., 60)"
                  className="border p-2 w-full mb-2"
                />
              )}

              {(form.conditional.type === "specific" ||
                form.conditional.type === "hybrid") && (
                <select
                  value={form.conditional.specificApprover || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      conditional: {
                        ...form.conditional,
                        specificApprover: e.target.value
                      }
                    })
                  }
                  className="border p-2 w-full"
                >
                  <option value="">
                    -- select specific approver (CFO etc) --
                  </option>
                  {companyUsers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <button className="bg-blue-600 text-white py-2 px-3 rounded">
                Create Rule
              </button>
            </div>
          </form>
        </div>

        {/* EXISTING RULES */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Existing Rules</h3>
          <div>
            {rules.map((r) => (
              <div key={r._id} className="border p-3 mb-2 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-sm text-gray-600">
                      Conditional: {r.conditional?.type || "none"}
                    </div>
                    <div className="text-sm mt-1">
                      Steps:
                      <ul className="list-disc ml-5">
                        {r.approvers.map((a) => (
                          <li
                            key={a._id || `${a.type}-${a.order}`}
                          >
                            {a.type} {a.role ? `(${a.role})` : ""}{" "}
                            {a.user ? `(user ${a.user.name || a.user})` : ""} - order{" "}
                            {a.order}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {rules.length === 0 && <div>No rules</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
