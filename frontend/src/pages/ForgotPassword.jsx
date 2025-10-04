import { useState } from "react";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email!");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("✅ Password sent to your email!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#f4f6f8] font-[Helvetica]">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg p-8 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center text-[#333333] mb-2">
          Forgot Password
        </h1>
        <p className="text-center text-[#6c757d] text-sm mb-6">
          Enter your registered email to receive a password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#333333] mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#333333] hover:bg-black"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <CircularProgress size={18} sx={{ color: "white" }} />
                Sending...
              </div>
            ) : (
              "Send Password"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <a
            href="/login"
            className="text-[#333333] font-medium hover:underline"
          >
            Back to Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}
