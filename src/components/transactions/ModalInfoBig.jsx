import React, { useEffect } from "react";
import { Info, X } from "lucide-react";

export default function ModalInfoBig({
  open = false,
  title = "Information",
  onClose,
  children,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose && onClose();
      }}
    >
      <div
        className="
          relative
          rounded-[24px] 
          p-[2px] 
          max-w-3xl
          w-full
          mx-4
          shadow-[0_0_30px_rgba(0,246,255,0.2)]
          animate-in zoom-in-95 duration-200
        "
        style={{
          background: "linear-gradient(135deg, #00f6ff, #8d00ff)",
        }}
      >
        <div
          className="
            bg-white 
            rounded-[22px] 
            p-6 md:p-8
            border border-gray-100
            bg-gradient-to-br from-white to-gray-50
            flex flex-col
            max-h-[80vh]
            dark:from-gray-800
            dark:to-gray-900
          "
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
                <Info size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto pr-2 text-gray-600 leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
