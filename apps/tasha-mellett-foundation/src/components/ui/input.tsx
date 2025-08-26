import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground",
            "flex h-[55px] text-[#1F1F1FCC] text-[18px] w-full rounded-full border bg-white px-4 py-2 text-lg shadow-sm transition-all duration-200",
            "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300",
            "selection:bg-blue-500 selection:text-white",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "dark:bg-input/30 dark:border-gray-600 dark:text-white",
            error && "border-red-500 focus:ring-red-200",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
