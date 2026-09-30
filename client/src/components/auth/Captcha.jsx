import React, { useCallback, useEffect, useState } from "react";

const makeCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let value = "";

  for (let i = 0; i < 6; i += 1) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }

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
    const value = event.target.value
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 6);

    setCode(value);

    onValidChange?.(value.toUpperCase() === captcha);
  };

  const isValid =
    code.length > 0 && code.toUpperCase() === captcha;

  const isInvalid =
    code.length > 0 && !isValid;

  return (
    <div className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">

      {/* CAPTCHA HEADER */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            Security verification
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            Enter the code shown below
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          title="Refresh CAPTCHA"
          aria-label="Refresh CAPTCHA"
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-lg
            border border-slate-200
            bg-white
            text-lg
            text-slate-600
            shadow-sm
            transition
            hover:bg-slate-100
            hover:text-blue-600
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            active:scale-95
          "
        >
          ↻
        </button>
      </div>

      {/* CAPTCHA CODE */}
      <div className="flex w-full items-center gap-3">

        <div
          aria-label="CAPTCHA code"
          className="
            flex
            min-w-0
            flex-1
            select-none
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border border-slate-300
            bg-white
            px-3
            py-3
            text-center
            font-mono
            text-xl
            font-bold
            tracking-[0.35em]
            text-slate-800
            sm:text-2xl
          "
        >
          {captcha}
        </div>

      </div>

      {/* INPUT */}
      <div className="mt-4">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          placeholder="Enter CAPTCHA"
          autoComplete="off"
          maxLength={6}
          required
          spellCheck={false}
          className={`
            block
            w-full
            min-w-0
            rounded-xl
            border
            bg-white
            px-4
            py-3
            text-sm
            font-medium
            uppercase
            tracking-widest
            text-slate-900
            outline-none
            transition
            placeholder:normal-case
            placeholder:tracking-normal
            placeholder:text-slate-400
            focus:ring-4

            ${
              isValid
                ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-100"
                : isInvalid
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }
          `}
        />
      </div>

      {/* STATUS */}
      <div className="mt-2 min-h-[18px]">
        {isValid ? (
          <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span>✓</span>
            CAPTCHA verified
          </p>
        ) : isInvalid ? (
          <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
            <span>!</span>
            CAPTCHA does not match
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Enter the 6-character code shown above
          </p>
        )}
      </div>
    </div>
  );
}