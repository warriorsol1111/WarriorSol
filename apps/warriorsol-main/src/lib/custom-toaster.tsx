// components/ui/CustomToaster.tsx
"use client";

import { Toaster, ToastBar, toast } from "react-hot-toast";
import { X } from "lucide-react";

export default function CustomToaster() {
  return (
    <Toaster
      toastOptions={{
        className: "!font-[Inter]",
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {icon}
                {message}
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
