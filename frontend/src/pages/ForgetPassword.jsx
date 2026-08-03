import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ForgetPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Password reset link sent!");
        setEmail("");
      } else {
        toast.error(data.message || "Email not found.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not connect to the backend.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Forgot Password</h1>

        <p className="auth-subtitle">
          Enter your registered email to reset your password.
        </p>

        <form onSubmit={handleForgotPassword}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">
            Send Reset Link
          </button>
        </form>

        <div className="auth-links">
          <Link to="/">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;