import React from "react";

export default function Button({ children, variant = "primary", loading = false, className = "", ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="spinner" /> : children}
    </button>
  );
}