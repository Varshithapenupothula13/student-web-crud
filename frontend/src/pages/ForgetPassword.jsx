import React, { useState } from "react";
import { toast } from "react-toastify";

function ForgetPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to Go backend
      // (Note: If your Go backend runs on a different port like 5000 or 3000, change 8080 below)
      const response = await fetch("http://localhost:8080/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Shown if status code is 200 (Email exists in MySQL)
        toast.success(data.message || "Password reset link sent successfully!");
        setEmail(""); // Clear the input field
      } else {
        // Shown if status code is 404 or 400 (Email not found)
        toast.error(data.message || "Failed to process request.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Could not connect to the backend server.");
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>

      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ForgetPassword;