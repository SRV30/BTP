import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await authApi.login(form);
      localStorage.setItem("moodsense_token", data.access_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form onSubmit={submit} className="card auth-card">
        <div>
          <h1>Welcome back</h1>
          <p>Log in to MoodSense AI</p>
        </div>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        {/* Password with Eye Toggle */}
        <label className="password-field">
          Password
          <div className="password-input">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={8}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        {error && <div className="error">{error}</div>}

        <button className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="hint">
          <Link to="#">Forgot Password!</Link>
        </p>

        <p className="hint">
          New user? <Link to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  );
}
