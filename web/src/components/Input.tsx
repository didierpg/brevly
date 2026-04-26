import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { WarningIcon } from "@phosphor-icons/react";
import { cn } from "../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  prefixText?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefixText, className, id, ...props }, ref) => {
    const isError = !!error;

    return (
      <div className="flex flex-col gap-2 group">
        <span
          className={cn(
            "text-xs uppercase transition-colors",
            "font-regular",
            "group-focus-within:text-blue-base",
            isError && "text-danger group-focus-within:text-danger",
          )}
        >
          {label}
        </span>

        <label
          htmlFor={id}
          className={cn(
            "flex items-center w-full px-4 rounded-lg border bg-white transition-all cursor-text",
            "border-gray-200",
            "focus-within:border-blue-base focus-within:ring-1.5",
            isError && "border-danger focus-within:border-danger",
          )}
        >
          {prefixText && (
            <span className="text-md text-gray-300 select-none pr-1">
              {prefixText}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full py-3 text-md text-gray-600 placeholder:text-gray-400 bg-transparent outline-none",
              className,
            )}
            {...props}
          />
        </label>

        {isError && (
          <div className="flex items-center gap-2 mt-1">
            <WarningIcon size={16} weight="fill" className="text-danger" />
            <span className="text-sm text-gray-500">{error}</span>
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
