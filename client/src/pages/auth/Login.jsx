import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Captcha from "../../components/auth/Captcha.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function Login() {
  const { login, loading } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryAdmin = new URLSearchParams(location.search).get("mode") === "admin";
  const [mode, setMode] = useState(queryAdmin ? "admin" : "user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);

  useEffect(() => setMode(queryAdmin ? "admin" : "user"), [queryAdmin]);

  const submit = async (event) => {
    event.preventDefault();
    if (!captchaValid) {
      notify("Please complete the CAPTCHA correctly.", "error");
      return;
    }

    try {
      const data = await login(email, password, mode === "admin" ? "ADMIN" : undefined);
      notify("Login successful.", "success");
      navigate(data.user.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
    } catch (error) {
      notify(error.message, "error");
    }
  };

  return (
    <AuthLayout title={mode === "admin" ? "Admin sign in" : "Welcome back"}>
      <div className="auth-tabs">
        <button type="button" className={mode === "user" ? "active" : ""} onClick={() => setMode("user")}>Buyer / Supplier</button>
        <button type="button" className={mode === "admin" ? "active admin-tab" : "admin-tab"} onClick={() => setMode("admin")}>Admin</button>
      </div>

      <form onSubmit={submit} className="form-stack">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        <Captcha onValidChange={setCaptchaValid} />
        <Button type="submit" loading={loading} disabled={!captchaValid}>
          {mode === "admin" ? "Sign in as Admin" : "Sign in"}
        </Button>
        {mode === "user" ? (
          <p className="form-note">New to the marketplace? <Link to="/register">Create an account</Link></p>
        ) : (
          <p className="form-note">Admin access is restricted to accounts with the ADMIN role.</p>
        )}
      </form>
    </AuthLayout>
  );
}

export function AuthLayout({ title, children }) {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-inner">
          <div className="brand brand-light"><div className="brand-mark">R</div><strong>RFQ Market</strong></div>
          <div className="hero-copy">
            <span className="eyebrow">B2B PROCUREMENT PLATFORM</span>
            <h1>Turn supplier discovery into a structured workflow.</h1>
            <p>Publish requirements, collect quotations, negotiate in real time and award with confidence.</p>
            <div className="feature-row"><span>✓ Email verified registration</span><span>✓ Real-time chat</span><span>✓ CAPTCHA protected login</span></div>
          </div>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <h2>{title}</h2>
          <p className="muted">Secure access to your procurement workspace.</p>
          {children}
        </div>
      </div>
    </div>
  );
}
