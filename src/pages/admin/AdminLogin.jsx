import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../src/styles/admin/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    /*
      Temporary admin login.
      Database authentication next step mein connect karenge.
    */
    setTimeout(() => {
      if (
        form.email === "admin@edunova.com" &&
        form.password === "admin123"
      ) {
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password.");
      }

      setLoading(false);
    }, 700);
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-wrapper">

        {/* LEFT BRAND AREA */}
        <div className="admin-login-brand">

          <div className="admin-brand-logo">
            E
          </div>

          <h1>
            EduNova
          </h1>

          <p>
            Admin Management Panel
          </p>

          <div className="admin-brand-line" />

          <span>
            Manage your institute,
            courses and students from one place.
          </span>

        </div>


        {/* LOGIN CARD */}
        <div className="admin-login-card">

          <div className="admin-login-heading">

            <span>
              ADMIN PORTAL
            </span>

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to continue to your dashboard.
            </p>

          </div>


          {/* ERROR */}
          {error && (
            <div className="admin-login-error">
              ⚠ {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="admin-login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@edunova.com"
                autoComplete="username"
              />

            </div>


            {/* PASSWORD */}
            <div className="admin-login-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="current-password"
              />

            </div>


            {/* LOGIN */}
            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In →"}
            </button>

          </form>


          <button
            type="button"
            className="admin-back-home"
            onClick={() => navigate("/")}
          >
            ← Back to Website
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;