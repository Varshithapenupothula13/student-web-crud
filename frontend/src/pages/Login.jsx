import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary login
    navigate("/dashboard");
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>

      <p>
        <Link to="/register">Register</Link>
      </p>

      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </div>
  );
}

export default Login;