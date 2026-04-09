import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const base =
    "rounded-2xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99]";
  const map = {
    primary: "bg-amber-500 text-white hover:bg-amber-600",
    secondary: "bg-emerald-500 text-white hover:bg-emerald-600",
    ghost: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  };

  return (
    <button {...props} className={`${base} ${map[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "green" | "red" | "blue" | "muted";
}) {
  const map: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-rose-50 text-rose-700",
    blue: "bg-blue-50 text-blue-700",
    muted: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${map[tone]}`}
    >
      {children}
    </span>
  );
}