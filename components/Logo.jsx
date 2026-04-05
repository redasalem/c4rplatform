import React from "react";

export default function Logo({ size = "md", className = "" }) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <span className={`${sizes[size]} font-black tracking-wider text-white`}>
        C4
      </span>
      <span className={`${sizes[size]} font-black tracking-wider text-orange-500`}>
        R
      </span>
    </div>
  );
}
