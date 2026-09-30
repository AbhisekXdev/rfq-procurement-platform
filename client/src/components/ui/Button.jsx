import React from "react";

const variantStyles = {
  primary: `
    bg-blue-600 text-white
    hover:bg-blue-700
    focus:ring-blue-500
    shadow-sm
  `,
  secondary: `
    bg-slate-100 text-slate-800
    hover:bg-slate-200
    focus:ring-slate-400
    border border-slate-200
  `,
  danger: `
    bg-red-600 text-white
    hover:bg-red-700
    focus:ring-red-500
    shadow-sm
  `,
  success: `
    bg-emerald-600 text-white
    hover:bg-emerald-700
    focus:ring-emerald-500
    shadow-sm
  `,
  outline: `
    bg-white text-blue-600
    border border-blue-600
    hover:bg-blue-50
    focus:ring-blue-500
  `,
  ghost: `
    bg-transparent text-slate-700
    hover:bg-slate-100
    focus:ring-slate-400
  `,
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) {
  const styles = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        inline-flex
        min-h-[44px]
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        px-4
        py-3
        text-sm
        font-semibold
        whitespace-nowrap
        transition-all
        duration-200
        active:scale-[0.98]
        focus:outline-none
        focus:ring-4
        disabled:cursor-not-allowed
        disabled:opacity-60
        disabled:hover:bg-current
        sm:w-auto
        ${styles}
        ${className}
      `}
    >
      {loading ? (
        <>
          <span
            className="
              h-5 w-5
              animate-spin
              rounded-full
              border-2
              border-white/30
              border-t-white
            "
            aria-hidden="true"
          />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}