import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ExpenseForm() {
  const [form, setForm] = useState({
    originalAmount: "",
    originalCurrency: "USD",
    category: "",
    description: "",
    approvalRuleId: "",
    submit: true,
  });
  const [rules, setRules] = useState([]);
  const [file, setFile] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const res = await api.get("/rules"); // ensure your backend has /rules endpoint
      setRules(res.data || []);
    } catch (err) {
      console.error("Failed to load rules", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Upload and OCR parse (calls backend)
  const handleUploadAndParse = async () => {
    if (!file) return alert("Please select a receipt file first!");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      const res = await api.post("/expenses/upload-receipt", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const parsed = res.data.parsed;
      setOcrResult(parsed);

      // Prefill form fields based on parsed OCR
      if (parsed) {
        setForm((prev) => ({
          ...prev,
          originalAmount: parsed.amount || prev.originalAmount,
          originalCurrency: parsed.currency || prev.originalCurrency,
          description: parsed.description || prev.description,
          category:
            parsed.description?.includes("Hotel")
              ? "Hotel"
              : parsed.description?.includes("Restaurant")
              ? "Meals"
              : prev.category,
        }));
      }

      alert("✅ Receipt scanned successfully and fields auto-filled!");
    } catch (err) {
      console.error("OCR parse failed:", err);
      alert("❌ OCR failed. Try again or upload a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle expense submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!form.originalAmount || !form.originalCurrency)
      return alert("Amount & currency are required!");

    setLoading(true);
    try {
      let receipts = [];
      if (file) {
        const fd = new FormData();
        fd.append("receipt", file);
        const upl = await api.post("/expenses/upload-receipt", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (upl.data?.filePath) receipts.push(upl.data.filePath);
      }

      const payload = {
        ...form,
        originalAmount: Number(form.originalAmount),
        receipts,
      };

      const res = await api.post("/expenses", payload);
      const ruleApplied = res.data?.rule || "Auto Rule Applied";
      setSuccessMessage(`✅ Expense submitted under "${ruleApplied}".`);

      // Reset form
      setForm({
        originalAmount: "",
        originalCurrency: "USD",
        category: "",
        description: "",
        approvalRuleId: "",
        submit: true,
      });
      setFile(null);
      setOcrResult(null);
    } catch (err) {
      console.error("Submit failed:", err);
      setErrorMessage(err.response?.data?.message || "Expense submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
        Add Expense
      </h2>

      {/* Alerts */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-3 border border-green-300">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3 border border-red-300">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid md:grid-cols-3 gap-2">
          <input
            name="originalAmount"
            value={form.originalAmount}
            onChange={handleChange}
            placeholder="Amount"
            type="number"
            min="0"
            className="border p-2 w-full rounded"
          />
          <input
            name="originalCurrency"
            value={form.originalCurrency}
            onChange={handleChange}
            placeholder="Currency (USD)"
            className="border p-2 w-full rounded"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Category</option>
            <option>Meals</option>
            <option>Travel</option>
            <option>Hotel</option>
            <option>Office</option>
            <option>Other</option>
          </select>
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Description (optional)"
        />

        {/* Approval Rule Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Approval Rule (optional)
          </label>
          <select
            name="approvalRuleId"
            value={form.approvalRuleId}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Auto-select rule</option>
            {rules.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upload + OCR Button */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="button"
            onClick={handleUploadAndParse}
            className="bg-gray-100 py-1 px-3 rounded hover:bg-gray-200 text-sm"
          >
            Parse Receipt (OCR)
          </button>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.submit}
              onChange={(e) => setForm({ ...form, submit: e.target.checked })}
            />
            <span>Submit now</span>
          </label>
        </div>

        {/* OCR Result Display */}
        {ocrResult && (
          <div className="bg-gray-50 p-3 rounded text-sm border">
            <b>OCR Result:</b>
            <div>Amount: {ocrResult.amount || "-"}</div>
            <div>Currency: {ocrResult.currency || "-"}</div>
            <div>Date: {ocrResult.date || "-"}</div>
            <div>Merchant: {ocrResult.merchant || "-"}</div>
            <div>Description: {ocrResult.description || "-"}</div>
          </div>
        )}

        {/* Submit + Reset */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-4 rounded text-white ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Expense"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({
                originalAmount: "",
                originalCurrency: "USD",
                category: "",
                description: "",
                approvalRuleId: "",
                submit: true,
              });
              setFile(null);
              setOcrResult(null);
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            className="bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
