import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "@/styles/Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const { createAccount } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!password.trim() || password !== confirmPassword) {
      setError("Please enter a matching password and confirmation.");
      return;
    }

    const result = createAccount({
      fullName,
      email,
      phone,
      password,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/profile", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-hero">
          <div>
            <p className="eyebrow">Create your account</p>
            <h1 className="auth-heading">Sign up to start ordering</h1>
            <p className="auth-text">
              Your profile will include your full name, email and phone number so you can place orders securely.
            </p>
          </div>
          <div className="auth-note">
            Enter your details below and create your password to sign up instantly.
          </div>
        </div>

        <div className="auth-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="field field-password">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="field field-password">
              <label>Confirm password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}
            <button type="submit" className="btn">
              Create account
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login" className="auth-link">
              Already have an account? Log in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
