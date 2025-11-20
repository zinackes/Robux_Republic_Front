import React from "react";
import { PlusCircle } from "lucide-react";

export default function SimpleModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      
      <div className="relative rounded-3xl p-[2px] max-w-md w-full bg-black overflow-hiddenshadow-[0_0_20px_rgba(0,255,200,0.25)]"
        style={{
          background: "linear-gradient(135deg, #0e0499ff, #2dafd3ff)",
        }}
      >
        <div className="bg-white rounded-3xl p-8 border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-shadow dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">

          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 border border-indigo-200 dark:bg-indigo-900 dark:border-indigo-800">
                <PlusCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {title}
              </h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
