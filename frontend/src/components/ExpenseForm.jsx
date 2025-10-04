import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { CircularProgress } from "@mui/material";
import { CloudUpload, Refresh } from "@mui/icons-material";

export default function ExpenseForm() {
  const [form, setForm] = useState({
    originalAmount: "",
    originalCurrency: "",
    category: "",
    description: "",
    approvalRuleId: "",
    submit: true,
  });
  const [rules, setRules] = useState([]);
  const [file, setFile] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currencyLoading, setCurrencyLoading] = useState(false);

  useEffect(() => {
    loadRules();
    fetchCurrency();
  }, []);

  const loadRules = async () => {
    try {
      const res = await api.get("/rules");
      setRules(res.data || []);
    } catch {
      toast.error("⚠️ Could not load approval rules");
    }
  };

  const fetchCurrency = async () => {
    setCurrencyLoading(true);
    try {
      const loc = await fetch("https://ipapi.co/json/");
      const data = await loc.json();
      const code = data.country_code;
      const countryRes = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
      const countryData = await countryRes.json();
      const currencyCode = Object.keys(countryData[0].currencies || {})[0] || "USD";
      setForm((p) => ({ ...p, originalCurrency: currencyCode }));
      toast.success(`Currency auto-detected: ${currencyCode}`);
    } catch {
      setForm((p) => ({ ...p, originalCurrency: "USD" }));
      toast.error("Failed to detect currency. Defaulted to USD");
    } finally {
      setCurrencyLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUploadAndParse = async () => {
    if (!file) return toast.error("Please select a receipt file first!");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      const res = await api.post("/expenses/upload-receipt", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const parsed = res.data.parsed;
      setOcrResult(parsed);

      if (parsed) {
        setForm((p) => ({
          ...p,
          originalAmount: parsed.amount || p.originalAmount,
          originalCurrency: parsed.currency || p.originalCurrency,
          description: parsed.description || p.description,
          category:
            parsed.description?.includes("Hotel")
              ? "Hotel"
              : parsed.description?.includes("Restaurant")
              ? "Meals"
              : p.category,
        }));
      }

      toast.success("Receipt parsed & fields auto-filled!");
    } catch {
      toast.error("OCR failed. Try again with a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.originalAmount) return toast.error("Enter amount before submitting!");

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
      toast.success(`Expense submitted successfully ✅`);
      setForm({
        originalAmount: "",
        originalCurrency: form.originalCurrency,
        category: "",
        description: "",
        approvalRuleId: "",
        submit: true,
      });
      setFile(null);
      setOcrResult(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-200 mt-6">
      <h2 className="text-3xl font-bold text-[#52a4b0] mb-6 text-center">
        Add New Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* AMOUNT + CURRENCY + CATEGORY */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Amount</label>
            <input
              name="originalAmount"
              value={form.originalAmount}
              onChange={handleChange}
              type="number"
              placeholder="Enter amount"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#52a4b0] outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Currency</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                name="originalCurrency"
                value={form.originalCurrency}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 cursor-not-allowed text-gray-600"
              />
              {currencyLoading && <CircularProgress size={20} />}
              <button
                type="button"
                onClick={fetchCurrency}
                className="p-1 text-[#52a4b0] hover:bg-gray-100 rounded"
              >
                <Refresh fontSize="small" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#52a4b0] outline-none"
            >
              <option value="">Select Category</option>
              <option>Meals</option>
              <option>Travel</option>
              <option>Hotel</option>
              <option>Office</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter a short description"
            rows={3}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#52a4b0] outline-none resize-none"
          />
        </div>

        {/* APPROVAL RULE */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Approval Rule (optional)
          </label>
          <select
            name="approvalRuleId"
            value={form.approvalRuleId}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#52a4b0] outline-none"
          >
            <option value="">Auto-select rule</option>
            {rules.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* FILE UPLOAD + OCR */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer bg-[#52a4b0]/10 text-[#52a4b0] hover:bg-[#52a4b0]/20 px-3 py-2 rounded-md transition">
            <CloudUpload fontSize="small" />
            <span>Upload Receipt</span>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleUploadAndParse}
            className="text-sm bg-gray-100 py-2 px-4 rounded hover:bg-gray-200 transition"
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

        {/* OCR Result */}
        {ocrResult && (
          <div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 mt-3">
            <b className="block text-[#52a4b0] mb-1">Scanned Receipt Info</b>
            <div>Amount: {ocrResult.amount || "-"}</div>
            <div>Currency: {ocrResult.currency || "-"}</div>
            <div>Date: {ocrResult.date || "-"}</div>
            <div>Merchant: {ocrResult.merchant || "-"}</div>
            <div>Description: {ocrResult.description || "-"}</div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setForm({
                originalAmount: "",
                originalCurrency: form.originalCurrency,
                category: "",
                description: "",
                approvalRuleId: "",
                submit: true,
              });
              setFile(null);
              setOcrResult(null);
              toast("Form reset successfully", { icon: "🔄" });
            }}
            className="py-2 px-5 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-6 rounded-md text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#52a4b0] hover:bg-[#4695a1]"
            }`}
          >
            {loading ? "Submitting..." : "Submit Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
