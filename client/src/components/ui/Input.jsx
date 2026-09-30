import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Input({
  label,
  error,
  type = "text",
  className = "",
  ...props
}) {
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <label className="block w-full min-w-0">
      {label && (
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </span>
      )}

      <div
        className={[
          "relative w-full min-w-0",
          "rounded-xl border bg-white",
          "transition-all duration-200",
          error
            ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100"
            : "border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100",
        ].join(" ")}
      >
        <input
          {...props}
          type={inputType}
          className={[
            "block w-full min-w-0",
            "rounded-xl bg-transparent",
            "px-4 py-3",
            "text-sm text-slate-900",
            "placeholder:text-slate-400",
            "outline-none",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            isPassword ? "pr-12" : "",
            className,
          ].join(" ")}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="
              absolute right-2 top-1/2
              flex h-9 w-9
              -translate-y-1/2
              items-center justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-1
            "
            aria-label={visible ? "Hide password" : "Show password"}
            title={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <FiEyeOff className="h-5 w-5" />
            ) : (
              <FiEye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <small className="mt-1.5 block text-xs font-medium text-red-600">
          {error}
        </small>
      )}
    </label>
  );
}