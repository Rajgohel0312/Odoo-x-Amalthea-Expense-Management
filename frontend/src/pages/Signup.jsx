import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    country: "India",
    currency: "INR"
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", form);
      login(res.data);
      alert("Signup successful!");
      if (res.data.user.role === "Admin") navigate("/admin");
      else if (res.data.user.role === "Manager") navigate("/manager");
      else navigate("/employee");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        <input
          name="name"
          placeholder="Your Name"
          className="border p-2 w-full mb-2"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="companyName"
          placeholder="Company Name"
          className="border p-2 w-full mb-2"
          value={form.companyName}
          onChange={handleChange}
          required
        />
        <input
          name="country"
          placeholder="Country"
          className="border p-2 w-full mb-2"
          value={form.country}
          onChange={handleChange}
        />
        <input
          name="currency"
          placeholder="Currency (e.g., INR, USD)"
          className="border p-2 w-full mb-4"
          value={form.currency}
          onChange={handleChange}
        />

        <button className="bg-green-600 text-white w-full py-2 rounded">Signup</button>
        <p className="text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">Login</a>
        </p>
      </form>
    </div>
  );
}
