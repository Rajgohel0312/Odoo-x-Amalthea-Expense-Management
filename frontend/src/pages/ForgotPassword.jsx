import { useState } from "react";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      alert("New password sent to your email!");
    } catch (err) {
      alert("Failed: " + (err.response?.data?.message || "Error"));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input className="border p-2 w-full mb-2" placeholder="Enter your email"
          value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <button className="bg-blue-600 text-white w-full py-2 rounded">Reset Password</button>
      </form>
    </div>
  );
}
