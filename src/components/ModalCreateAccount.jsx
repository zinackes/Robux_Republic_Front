import React, { useState } from "react";

export default function SimpleModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition">✕</button>
        </div>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Fermer</button>
          <button className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Créer un compte</button>
        </div>
      </div>
    </div>
  );
}
