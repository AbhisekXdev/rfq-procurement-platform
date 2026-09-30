import React from "react";

export default function Card({
  title,
  action,
  children,
  className = "",
}) {
  return (
    <section
      className={[
        "w-full min-w-0",
        "overflow-hidden",
        "rounded-2xl",
        "border border-slate-200",
        "bg-white",
        "shadow-sm",
        "transition-shadow duration-200",
        "hover:shadow-md",
        className,
      ].join(" ")}
    >
      {(title || action) && (
        <div
          className="
            flex w-full min-w-0
            flex-col gap-3
            border-b border-slate-100
            px-4 py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-5
            lg:px-6
          "
        >
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                {title}
              </h3>
            )}
          </div>

          {action && (
            <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
              {action}
            </div>
          )}
        </div>
      )}

      <div className="w-full min-w-0 p-4 sm:p-5 lg:p-6">
        {children}
      </div>
    </section>
  );
}