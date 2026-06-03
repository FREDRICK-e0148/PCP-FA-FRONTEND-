import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext.jsx";

const Login = () => {
  const { login, dispatch } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@placements.local");
  const [password, setPassword] = useState("Admin@123");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      dispatch({ type: "SET_NOTICE", payload: error.message });
    }
  };

  return (
    <section className="auth-panel">
      <form data-testid="login-form" onSubmit={submit} className="form-card">
        <h1>Placement Recruitment System</h1>
        <label>Email</label>
        <input data-testid="email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input data-testid="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button data-testid="login-btn" type="submit">Login</button>
      </form>
    </section>
  );
};

export default Login;
