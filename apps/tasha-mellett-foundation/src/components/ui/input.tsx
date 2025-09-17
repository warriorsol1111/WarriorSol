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
          <label className="block text-sm font-medium text-[#1F1F1F] mb-1">
            {label}
          </label>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground text-sm md:text-[18px] focus:outline-none focus:!ring-2 focus:!ring-[#C1E965] focus:!ring-offset-0",
            "  text-[#1f1f1f]",
            "flex h-10 md:h-14 w-full !rounded-full border bg-white px-4 py-2  !text-[#1F1F1FCC] shadow-sm transition-all duration-200",
            "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300",
            "selection:bg-blue-500 selection:text-white",
            " disabled:!text-gray-500 disabled:shadow-none",
            "dark:bg-input/30 dark:border-gray-600 dark:text-white",
            "disabled:pointer-events-none disabled:!cursor-not-allowed",
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
