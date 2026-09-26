import React from "react";

export default function Card({ title, action, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <div className="card-header">
          <div>{title && <h3>{title}</h3>}</div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}