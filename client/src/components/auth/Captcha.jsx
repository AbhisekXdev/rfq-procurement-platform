import React, { useCallback, useEffect, useState } from "react";

const makeCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  for (let i = 0; i < 6; i += 1) value += chars[Math.floor(Math.random() * chars.length)];
  return value;
};

export default function Captcha({ onValidChange }) {
  const [code, setCode] = useState("");
  const [captcha, setCaptcha] = useState(makeCaptcha);

  const refresh = useCallback(() => {
    const next = makeCaptcha();
    setCaptcha(next);
    setCode("");
    onValidChange?.(false);
  }, [onValidChange]);

  useEffect(() => {
    onValidChange?.(false);
  }, [captcha, onValidChange]);

  const handleChange = (event) => {
    const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    setCode(value);
    onValidChange?.(value === captcha);
  };

  return (
    <div className="captcha-box">
      <div className="captcha-row">
        <div className="captcha-code" aria-label="CAPTCHA code">{captcha}</div>
        <button type="button" className="captcha-refresh" onClick={refresh} title="Refresh CAPTCHA">↻</button>
      </div>
      <input
        className="captcha-input"
        value={code}
        onChange={handleChange}
        placeholder="Enter CAPTCHA"
        autoComplete="off"
        maxLength={6}
        required
      />
      <small className={code ? (code === captcha ? "captcha-ok" : "captcha-error") : "muted"}>
        {code ? (code === captcha ? "CAPTCHA verified" : "CAPTCHA does not match") : "Enter the code shown above"}
      </small>
    </div>
  );
}
