// frontend/pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "../services/auth";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(form);

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.accessToken);
      }

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h2 className="mb-4 text-center">Login</h2>
      <div className="card p-3">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
