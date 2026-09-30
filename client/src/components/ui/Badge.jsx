import React from "react";

const toneStyles = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",

  primary: "bg-blue-50 text-blue-700 ring-blue-200",

  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",

  warning: "bg-amber-50 text-amber-700 ring-amber-200",

  danger: "bg-red-50 text-red-700 ring-red-200",

  info: "bg-cyan-50 text-cyan-700 ring-cyan-200",

  purple: "bg-purple-50 text-purple-700 ring-purple-200",
};

export default function Badge({
  children,
  tone = "neutral",
}) {
  const styles = toneStyles[tone] || toneStyles.neutral;

  return (
    <span
      className={`
        inline-flex
        max-w-full
        items-center
        justify-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        leading-4
        whitespace-nowrap
        ring-1
        ring-inset
        ${styles}
      `}
    >
      {children}
    </span>
  );
}