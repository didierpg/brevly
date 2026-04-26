import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils"; // Aquela função que criamos

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "p-2 rounded-sm font-semibold text-md transition-all flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-blue-base text-white hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-gray-200 hover:ring-1 hover:ring-blue-base disabled:ring-0 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
