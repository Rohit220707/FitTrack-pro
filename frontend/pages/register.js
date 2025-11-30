// frontend/pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "../services/auth";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success("Registered successfully! Please login.");
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 460 }}>
      <h2 className="mb-4 text-center">Register</h2>
      <div className="card p-3">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Name</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
