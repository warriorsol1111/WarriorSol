import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}
function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground font-[Inter]",
        "flex h-12 w-full rounded-md border bg-white px-4 py-2 !text-lg !text-[#1F1F1FCC] shadow-sm transition-all duration-200",
        "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300",
        "selection:bg-blue-500 selection:text-white",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "dark:bg-input/30 dark:border-gray-600 dark:text-white",
        error && "border-red-500 focus:ring-red-200",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
