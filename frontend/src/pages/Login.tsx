import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "@/styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";
  const { user, loginWithPassword, requestPasswordReset, resetPassword } = useAuth();

  const [step, setStep] = useState<"password" | "reset-send" | "reset-verify">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/profile", { replace: true });
  }, [user, navigate]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const result = loginWithPassword(email, password);
    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate(from, { replace: true });
  };

  const startForgotPassword = () => {
    setError("");
    setMessage("");
    setResetEmail(email);
    setCode("");
    setNewPassword("");
    setStep("reset-send");
  };

  const handleResetSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const result = await requestPasswordReset(resetEmail);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setMessage(result.message);
    setStep("reset-verify");
  };

  const handleResetVerify = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const result = resetPassword(code, newPassword);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setMessage(result.message);
    setStep("password");
    setEmail(resetEmail);
    setPassword("");
    setCode("");
    setNewPassword("");
  };

  const heading =
    step === "password"
      ? "Sign in with your password"
      : step === "reset-send"
      ? "Reset your password"
      : "Enter your reset code";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-hero">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="auth-heading">{heading}</h1>
            <p className="auth-text">
              {step === "password"
                ? "Use your email and password to log in and manage your account."
                : step === "reset-send"
                ? "Enter your account email to receive a password reset code."
                : "Enter the code we emailed you, then choose a new password."}
            </p>
          </div>
          <div className="auth-note">
            Password login is the primary method. Code delivery is only used when resetting a forgotten password.
          </div>
        </div>

        <div className="auth-panel">
          {step === "password" ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="field">
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                    placeholder="••••••••"
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

              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success">{message}</div>}

              <button type="submit" className="btn">
                Sign in
              </button>
              <button type="button" className="auth-link" onClick={startForgotPassword}>
                Forgot password?
              </button>
            </form>
          ) : step === "reset-send" ? (
            <form className="auth-form" onSubmit={handleResetSend}>
              <div className="field">
                <label>Email address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success">{message}</div>}

              <button type="submit" className="btn">
                Send reset code
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setStep("password")}>Back to login</button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleResetVerify}>
              <div className="field">
                <label>Reset code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              <div className="field field-password">
                <label>New password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Choose a new password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword((current) => !current)}
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success">{message}</div>}

              <button type="submit" className="btn">
                Reset password
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setStep("password")}>Back to login</button>
            </form>
          )}

          <div className="auth-footer">
            <Link to="/signup" className="auth-link">
              Don&apos;t have an account? 
              <span>Sign up now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
