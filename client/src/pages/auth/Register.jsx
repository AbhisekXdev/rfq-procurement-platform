import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { AuthLayout } from "./Login.jsx";

export default function Register() {
  const { register, verifyRegistration, resendRegistrationOtp, loading } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "BUYER" });
  const [otp, setOtp] = useState("");
  const [expires, setExpires] = useState(null);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    try {
      const data = await register(form);
      setExpires(data.otpExpiresIn);
      setStep("otp");
      notify("Registration OTP sent to your email.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    try {
      const data = await verifyRegistration(form.email, otp);
      notify("Account verified successfully.", "success");
      navigate(data.user.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const resend = async () => {
    try {
      const data = await resendRegistrationOtp(form.email);
      setExpires(data.otpExpiresIn);
      notify("A new OTP has been sent.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  return (
    <AuthLayout title={step === "form" ? "Create your workspace" : "Verify your email"}>
      {step === "form" ? (
        <form onSubmit={submit} className="form-stack">
          <Input label="Full name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          <Input label="Work email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} minLength={8} required />
          <label className="field"><span>Account type</span><select value={form.role} onChange={(e) => update("role", e.target.value)}><option value="BUYER">Buyer</option><option value="SUPPLIER">Supplier</option></select></label>
          <Button type="submit" loading={loading}>Create account & send OTP</Button>
          <p className="form-note">Already registered? <Link to="/login">Sign in</Link></p>
        </form>
      ) : (
        <form onSubmit={verify} className="form-stack">
          <p className="muted">Enter the 6-digit code sent to <strong>{form.email}</strong>.</p>
          {expires && <p className="otp-timer">OTP expires in {Math.ceil(expires / 60)} minutes.</p>}
          <Input label="Verification code" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" required />
          <Button type="submit" loading={loading} disabled={otp.length !== 6}>Verify email & activate account</Button>
          <button className="link-button" type="button" onClick={resend}>Resend registration OTP</button>
          <button className="link-button" type="button" onClick={() => setStep("form")}>Change registration details</button>
        </form>
      )}
    </AuthLayout>
  );
}
