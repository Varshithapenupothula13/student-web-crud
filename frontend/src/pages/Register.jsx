import React, {useState} from "react";
import { Link } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const handleRegister = async (e) => {
    e.preventDefault();
const response = await fetch("http://localhost:8080/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
  }),
});

const data = await response.json();

alert(data.message);
};
  return (
    <div>
        <form
        onSubmit={handleRegister}>
      <h1>Register</h1>

      <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>

      
      <button type="submit">
  Register
</button>
</form>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;